import React, { useState } from 'react';
import '../styles/ModelSummary.css';
import Select from 'react-select';
import { useForm, Controller } from 'react-hook-form';
import calculateTotalMemory from '../scripts/modelMemoryCalculation';
import CalculateButton from './CalculateButton';
import VRAMResult from './VRAMResult';
import { Tooltip } from 'react-tooltip';

const customStyles = {
  control: (provided) => ({
    ...provided,
    backgroundColor: 'transparent',
    border: '1px solid #9DE5FF',
    borderRadius: '8px',
    boxShadow: 'none',
    color: '#9DE5FF',
    padding: '8px',
    marginBottom: '16px',
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#9DE5FF',
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: '#4A4A4A',
    borderRadius: '8px',
    marginTop: '4px',
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#666666' : '#4A4A4A',
    color: '#9DE5FF',
    padding: '12px',
  }),
};

const libraryOptions = [
  { value: 'pytorch', label: 'PyTorch' },
  { value: 'tensorflow', label: 'TensorFlow' },
  { value: 'keras', label: 'Keras' },
  { value: 'jax', label: 'JAX' },
];

export default function ModelSummary() {
  const { register, handleSubmit, control, formState: { errors } } = useForm();
  const [vramResult, setVramResult] = useState(null);

  const onSubmit = (data) => {
    console.log(data);

    if (data.summary && data.library && data.inputSize && data.batchSize && data.weightsPrecision && data.gradientsPrecision && data.optimizer) {
      const result = calculateTotalMemory(
        data.paramCount,
        data.batchSize,
        data.inputSize,
        data.weightsPrecision.value,
        data.gradientsPrecision.value,
        data.training,
        data.optimizer.value,
        data.summary,
        data.library.value
      );
      setVramResult(result);
    } else {
      alert('Please fill in all fields before calculating VRAM.');
    }
  };

  return (
    <form className="modelSummaryForm" onSubmit={handleSubmit(onSubmit)}>
     <div className="formGrid">
        <div className="formField fullWidth">
          <label>Model Summary          
            <span className="tooltip-trigger" data-tooltip-id="summary-tooltip">?</span>
          </label>
          <textarea 
            {...register('summary')} 
            rows="10" 
            cols="50" 
            placeholder="Paste your model summary here. For example:
Layer (type)                 Output Shape              Param #   
=================================================================
conv2d (Conv2D)              (None, 222, 222, 32)      896       
max_pooling2d (MaxPooling2D) (None, 111, 111, 32)      0         
flatten (Flatten)            (None, 393248)            0         
dense (Dense)                (None, 64)                25167936  
dense_1 (Dense)              (None, 10)                650       
=================================================================
Total params: 25,169,482
Trainable params: 25,169,482
Non-trainable params: 0"
          />
          <Tooltip id="summary-tooltip" place="top" effect="solid">
            Paste the model summary from your framework. For PyTorch, use torchsummary. For TensorFlow/Keras, use model.summary().
          </Tooltip>
        </div>
        <div className="formField">
          <label>Library
          <span className="tooltip-trigger" data-tooltip-id="library-tooltip">?</span>
          </label>
          <Controller
            name="library"
            control={control}
            defaultValue={{ value: 'pytorch', label: 'PyTorch' }}
            render={({ field }) => (
              <Select
                {...field}
                options={libraryOptions}
                styles={customStyles}
              />
            )}
          />
            <Tooltip id="library-tooltip" place="top" effect="solid">
            Choose the library format that your summary has.
          </Tooltip>
        </div>
        <div className="formField">
          <label>
            Input shape
            <span className="tooltip-trigger" data-tooltip-id="input-size-tooltip">?</span>
          </label>
          <input type="text" {...register('inputSize')} placeholder="e.g., [224,224,3]" />
          <Tooltip id="input-size-tooltip" place="top" effect="solid">
            The dimensions of a single input to your model. For example, [224,224,3] for a 224x224 RGB image.
          </Tooltip>
        </div>
        <div className="formField">
          <label>
            Batch size
            <span className="tooltip-trigger" data-tooltip-id="batch-size-tooltip">?</span>
          </label>
          <input type="text" {...register('batchSize')} placeholder="e.g., 32" />
          <Tooltip id="batch-size-tooltip" place="top" effect="solid">
            The number of samples processed in one forward/backward pass. Common values are 32, 64, or 128.
          </Tooltip>
        </div>
        <div className="formField">
          <label>
            Weights precision
            <span className="tooltip-trigger" data-tooltip-id="weights-precision-tooltip">?</span>
          </label>
          <Controller
            name="weightsPrecision"
            control={control}
            defaultValue={{ value: 'float32', label: 'Float32' }}
            render={({ field }) => (
              <Select
                {...field}
                options={[
                  { value: 'float64', label: 'Float64' },
                  { value: 'float32', label: 'Float32' },
                  { value: 'float16', label: 'Float16' },
                  { value: 'float8', label: 'Float8' },
                ]}
                styles={customStyles}
              />
            )}
          />
          <Tooltip id="weights-precision-tooltip" place="top" effect="solid">
            The numerical precision used for storing model weights
          </Tooltip>
        </div>
        <div className="formField">
          <label>
            Gradients Precision
            <span className="tooltip-trigger" data-tooltip-id="gradients-precision-tooltip">?</span>
          </label>
          <Controller
            name="gradientsPrecision"
            control={control}
            defaultValue={{ value: 'float32', label: 'Float32' }}
            render={({ field }) => (
              <Select
                {...field}
                options={[
                  { value: 'float64', label: 'Float64' },
                  { value: 'float32', label: 'Float32' },
                  { value: 'float16', label: 'Float16' },
                  { value: 'float8', label: 'Float8' },
                ]}
                styles={customStyles}
              />
            )}
          />
          <Tooltip id="gradients-precision-tooltip" place="top" effect="solid">
            The numerical precision used for storing gradients during training
          </Tooltip>
        </div>
        <div className="formField">
          <label>
            Optimizer
            <span className="tooltip-trigger" data-tooltip-id="optimizer-tooltip">?</span>
          </label>
          <Controller
            name="optimizer"
            control={control}
            defaultValue={{ value: 'adam', label: 'Adam' }}
            render={({ field }) => (
              <Select
                {...field}
                options={[
                  { value: 'adam', label: 'Adam' },
                  { value: 'sgd', label: 'SGD' },
                  { value: 'rmsprop', label: 'RMSprop' },
                  { value: 'adagrad', label: 'Adagrad' },
                ]}
                styles={customStyles}
              />
            )}
          />
          <Tooltip id="optimizer-tooltip" place="top" effect="solid">
            The optimization algorithm used for training the model
          </Tooltip>
        </div>
        <div className="formField checkboxField">
          <label>
            <input type="checkbox" {...register('training')} />
            Training
          </label>
        </div>
      </div>
      <div className="formActions">
        <CalculateButton onClick={handleSubmit(onSubmit)} />
      </div>

      {vramResult && <VRAMResult vram={vramResult} />}
    </form>
  );
}
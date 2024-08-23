import React, { useState } from 'react';
import '../styles/Form.css';
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
    border: 'none',
    boxShadow: 'none',
    color: '#9DE5FF',
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#9DE5FF',
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: '#4A4A4A',
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#666666' : '#4A4A4A',
    color: '#9DE5FF',
  }),
};

export default function Form() {
  const { register, handleSubmit, control, watch } = useForm();
  const [vramResult, setVramResult] = useState(null);

  const onSubmit = (data) => {
    if (data.paramCount && data.batchSize && data.inputSize && data.weightsPrecision && data.gradientsPrecision && data.optimizer) {
      const result = calculateTotalMemory(
        data.paramCount,
        data.batchSize,
        data.inputSize,
        data.weightsPrecision.value,
        data.gradientsPrecision.value,
        data.training,
        data.optimizer.value,
        data.summary, // Add this if you include summary in the form
        data.library   // Add this if you include library in the form
      );
      setVramResult(result);
    } else {
      alert('Please fill in all fields before calculating VRAM.');
    }
  };

  return (
    <form className="formContainer" onSubmit={handleSubmit(onSubmit)}>
      <div className="formRow">
        <div className="formField">
            <label>
              Parameter count
              <span className="tooltip-trigger" data-tooltip-id="param-count-tooltip">?</span>
            </label>
            <input type="text" {...register('paramCount')} />
            <Tooltip id="param-count-tooltip" place="top" effect="solid">
              The total number of trainable parameters in your model
            </Tooltip>
        </div>
          <div className="formField">
          <label>
            Input shape
            <span className="tooltip-trigger" data-tooltip-id="input-size-tooltip">?</span>
          </label>
          <input type="text" {...register('inputSize')} />
          <Tooltip id="input-size-tooltip" place="top" effect="solid">
            The dimensions of a single input to your model (e.g., [224,224,3] for an image). It must be an array between [] or an integer.
          </Tooltip>
        </div>
      </div>
      <div className="formRow">
      <div className="formField">
          <label>
            Batch size
            <span className="tooltip-trigger" data-tooltip-id="batch-size-tooltip">?</span>
          </label>
          <input type="text" {...register('batchSize')} />
          <Tooltip id="batch-size-tooltip" place="top" effect="solid">
            The number of samples processed in one forward/backward pass
          </Tooltip>
        </div>
        <div className="formField checkboxField">
          <label>
            <input type="checkbox" {...register('training')} />
            Training
            <span className="tooltip-trigger" data-tooltip-id="training-tooltip">?</span>
          </label>
          <Tooltip id="training-tooltip" place="top" effect="solid">
            Check if you're training the model and blank if you are only doing inference
          </Tooltip>
        </div>
      </div>
      <div className="formRow">
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
      </div>
      <div className="formRow">
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
      </div>

      {/* Calculate VRAM Button */}
      <div className="formRow">
        <CalculateButton onClick={handleSubmit(onSubmit)} />
      </div>

      {vramResult && <VRAMResult vram={vramResult} />}
    </form>
  );
}

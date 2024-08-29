import React, { useState } from 'react';
import '../styles/ModelSummary.css';
import Select from 'react-select';
import { useForm, Controller } from 'react-hook-form';
import calculateTotalMemory from '../scripts/modelMemoryCalculation';
import CalculateButton from './CalculateButton';
import VRAMResult from './VRAMResult';
import { Tooltip } from 'react-tooltip';
import FieldTutorial from './FieldTutorial';

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
  { value: 'tensorflow', label: 'TensorFlow/Keras' },
];

const tutorialSteps = [
  {
    fieldId: 'summary',
    title: 'Model Summary',
    content: 'Paste your model summary here. For PyTorch, use:\n\nfrom torchsummary import summary\nsummary(model, input_shape)\n \n \n For TensorFlow/Keras, use:\n\nmodel.summary()'
  },
  {
    fieldId: 'library',
    title: 'Library',
    content: 'Select the deep learning library you\'re using (PyTorch, TensorFlow, Keras).'
  },
  {
    fieldId: 'inputSize',
    title: 'Input Shape',
    content: 'Specify the dimensions of a single input to your model. For example, for a 224x224 RGB image, you would enter [224,224,3].'
  },
  {
    fieldId: 'batchSize',
    title: 'Batch Size',
    content: 'Enter the number of samples processed in one forward/backward pass. Common values are 32, 64, or 128.'
  },
  {
    fieldId: 'weightsPrecision',
    title: 'Weights Precision',
    content: 'Select the numerical precision used for storing model weights. This is typically float32 for most models.'
  },
  {
    fieldId: 'gradientsPrecision',
    title: 'Gradients Precision',
    content: 'Select the numerical precision used for storing gradients during training. This is often the same as the weights precision.'
  },
  {
    fieldId: 'optimizer',
    title: 'Optimizer',
    content: 'Choose the optimization algorithm used for training the model. Adam is a popular choice for many applications.'
  },
  {
    fieldId: 'training',
    title: 'Training',
    content: 'Check this box if you\'re training the model. Leave it unchecked for inference only.'
  }
];

export default function ModelSummary() {
  const { register, handleSubmit, control, formState: { errors }, setError, clearErrors } = useForm();
  const [vramResult, setVramResult] = useState(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [warning, setWarning] = useState(null);

  const validateNumeric = (value) => {
    if (!/^\d*\.?\d+$/.test(value)) {
      return 'Please enter a valid number';
    }
    return true;
  };

  const validateInputShape = (value) => {
    if (!/^\d+$/.test(value) && !/^\[\s*\d+(?:\s*,\s*\d+)*\s*\]$/.test(value)) {
      return 'Please enter a valid number or a list of numbers in square brackets (e.g., [224,224,3])';
    }
    return true;
  };

  const onSubmit = (data) => {
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
      if (result=== 0) {
        setWarning('No parameters were detected in the summary. Please check your input and try again.');
      } else {
        setWarning(null);
      }

      setVramResult(result);
    } else {
      alert('Please fill in all fields before calculating VRAM.');
    }
  };

  return (
    <div className="formWrapper">
      <button type="button" className="tutorial-button" onClick={() => setShowTutorial(true)}>
        Tutorial
      </button>
      <form className="modelSummaryForm" onSubmit={handleSubmit(onSubmit)}>
        <div className="formGrid">
          <div className="formField fullWidth">
            <label htmlFor="summary">
              Model Summary          
              <span className="tooltip-trigger" data-tooltip-id="summary-tooltip">?</span>
            </label>
            <textarea 
              id="summary"
              {...register('summary', { required: "Model summary is required" })}
              rows="10" 
              cols="50" 
              placeholder="Paste your model summary here. For example:
----------------------------------------------------------------
        Layer (type)               Output Shape         Param #
================================================================
            Conv2d-1            [-1, 5, 28, 28]              50
         MaxPool2d-2            [-1, 5, 14, 14]               0
            Conv2d-3            [-1, 5, 14, 14]             230
         MaxPool2d-4              [-1, 5, 7, 7]               0
           Flatten-5                  [-1, 245]               0
            Linear-6                 [-1, 1500]         369,000
            Linear-7                 [-1, 1500]       2,251,500
            Linear-8                 [-1, 5000]       7,505,000
            Linear-9                 [-1, 5000]      25,005,000
           Linear-10                   [-1, 10]          50,010
================================================================
Total params: 35,180,790
Trainable params: 35,180,790
Non-trainable params: 0
----------------------------------------------------------------
Input size (MB): 0.00
Forward/backward pass size (MB): 0.15
Params size (MB): 134.20
Estimated Total Size (MB): 134.35
----------------------------------------------------------------"
            />
            {errors.summary && <span className="error-message">{errors.summary.message}</span>}
            <Tooltip id="summary-tooltip" place="top" effect="solid">
              Paste the model summary from your framework. For PyTorch, use torchsummary. For TensorFlow/Keras, use model.summary().
            </Tooltip>
          </div>
          <div className="formField">
            <label htmlFor="library">
              Library
              <span className="tooltip-trigger" data-tooltip-id="library-tooltip">?</span>
            </label>
            <Controller
              name="library"
              control={control}
              defaultValue={{ value: 'pytorch', label: 'PyTorch' }}
              rules={{ required: "Library is required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  inputId="library"
                  options={libraryOptions}
                  styles={customStyles}
                />
              )}
            />
            {errors.library && <span className="error-message">{errors.library.message}</span>}
            <Tooltip id="library-tooltip" place="top" effect="solid">
              Choose the library format that your summary has.
            </Tooltip>
          </div>
          <div className="formField">
            <label htmlFor="inputSize">
              Input shape
              <span className="tooltip-trigger" data-tooltip-id="input-size-tooltip">?</span>
            </label>
            <input
              id="inputSize"
              type="text"
              {...register('inputSize', { 
                required: "Input shape is required",
                validate: validateInputShape
              })}
              placeholder="e.g., [224,224,3]"
            />
            {errors.inputSize && <span className="error-message">{errors.inputSize.message}</span>}
            <Tooltip id="input-size-tooltip" place="top" effect="solid">
              The dimensions of a single input to your model. For example, [224,224,3] for a 224x224 RGB image.
            </Tooltip>
          </div>
          <div className="formField">
            <label htmlFor="batchSize">
              Batch size
              <span className="tooltip-trigger" data-tooltip-id="batch-size-tooltip">?</span>
            </label>
            <input
              id="batchSize"
              type="text"
              {...register('batchSize', { 
                required: "Batch size is required",
                validate: validateNumeric
              })}
              placeholder="e.g., 32"
            />
            {errors.batchSize && <span className="error-message">{errors.batchSize.message}</span>}
            <Tooltip id="batch-size-tooltip" place="top" effect="solid">
              The number of samples processed in one forward/backward pass. Common values are 32, 64, or 128.
            </Tooltip>
          </div>
          <div className="formField">
            <label htmlFor="weightsPrecision">
              Weights precision
              <span className="tooltip-trigger" data-tooltip-id="weights-precision-tooltip">?</span>
            </label>
            <Controller
              name="weightsPrecision"
              control={control}
              defaultValue={{ value: 'float32', label: 'Float32' }}
              rules={{ required: "Weights precision is required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  inputId="weightsPrecision"
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
            {errors.weightsPrecision && <span className="error-message">{errors.weightsPrecision.message}</span>}
            <Tooltip id="weights-precision-tooltip" place="top" effect="solid">
              The numerical precision used for storing model weights
            </Tooltip>
          </div>
          <div className="formField">
            <label htmlFor="gradientsPrecision">
              Gradients Precision
              <span className="tooltip-trigger" data-tooltip-id="gradients-precision-tooltip">?</span>
            </label>
            <Controller
              name="gradientsPrecision"
              control={control}
              defaultValue={{ value: 'float32', label: 'Float32' }}
              rules={{ required: "Gradients precision is required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  inputId="gradientsPrecision"
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
            {errors.gradientsPrecision && <span className="error-message">{errors.gradientsPrecision.message}</span>}
            <Tooltip id="gradients-precision-tooltip" place="top" effect="solid">
              The numerical precision used for storing gradients during training
            </Tooltip>
          </div>
          <div className="formField">
            <label htmlFor="optimizer">
              Optimizer
              <span className="tooltip-trigger" data-tooltip-id="optimizer-tooltip">?</span>
            </label>
            <Controller
              name="optimizer"
              control={control}
              defaultValue={{ value: 'adam', label: 'Adam' }}
              rules={{ required: "Optimizer is required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  inputId="optimizer"
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
            {errors.optimizer && <span className="error-message">{errors.optimizer.message}</span>}
            <Tooltip id="optimizer-tooltip" place="top" effect="solid">
              The optimization algorithm used for training the model
            </Tooltip>
          </div>
          <div className="formField checkboxField">
            <label htmlFor="training">
              <input id="training" type="checkbox" {...register('training')} />
              Training
              <span className="tooltip-trigger" data-tooltip-id="training-tooltip">?</span>
            </label>
            <Tooltip id="training-tooltip" place="top" effect="solid">
              Check if you're training the model. Leave unchecked for inference only.
            </Tooltip>
          </div>
        </div>
        <div className="formActions">
          <CalculateButton onClick={handleSubmit(onSubmit)} />
        </div>

        {warning && <div className="warning-message">{warning}</div>}
        {vramResult && <VRAMResult vram={vramResult} />}
      </form>

      {showTutorial && (
        <FieldTutorial steps={tutorialSteps} onClose={() => setShowTutorial(false)} />
      )}
    </div>
  );
}
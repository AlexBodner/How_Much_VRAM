import React, { useState } from 'react';
import '../styles/Form.css';
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

const tutorialSteps = [
  {
    fieldId: 'paramCount',
    title: 'Parameter Count',
    content: 'Enter the total number of trainable parameters in your model. You can usually find this information in your model\'s summary or by printing the model in your code.'
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
    fieldId: 'training',
    title: 'Training',
    content: 'Check this box if you\'re training the model. Leave it unchecked for inference only.'
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
  }
];

export default function Form() {
  const { register, handleSubmit, control, formState: { errors } } = useForm();
  const [vramResult, setVramResult] = useState(null);
  const [showTutorial, setShowTutorial] = useState(false);

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
    if (data.paramCount && data.batchSize && data.inputSize && data.weightsPrecision && data.gradientsPrecision && data.optimizer) {
      const result = calculateTotalMemory(
        data.paramCount,
        data.batchSize,
        data.inputSize,
        data.weightsPrecision.value,
        data.gradientsPrecision.value,
        data.training,
        data.optimizer.value,
        data.summary,
        data.library
      );
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
      <form className="formContainer" onSubmit={handleSubmit(onSubmit)}>
        <div className="formRow">
          <div className="formField">
            <label htmlFor="paramCount">
              Parameter count
              <span className="tooltip-trigger" data-tooltip-id="param-count-tooltip">?</span>
            </label>
            <input
              id="paramCount"
              type="text"
              {...register('paramCount', { 
                required: "Parameter count is required",
                validate: validateNumeric
              })}
              placeholder="e.g., 1000000"
            />
            {errors.paramCount && <span className="error-message">{errors.paramCount.message}</span>}
            <Tooltip id="param-count-tooltip" place="top" effect="solid">
              The total number of trainable parameters in your model. For example, a small model might have 1,000,000 parameters.
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
        </div>
        <div className="formRow">
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
        <div className="formRow">
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
        </div>
        <div className="formRow">
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
        </div>

        <div className="formRow">
          <CalculateButton onClick={handleSubmit(onSubmit)} />
        </div>

        {vramResult && <VRAMResult vram={vramResult} />}
      </form>

      {showTutorial && (
        <FieldTutorial steps={tutorialSteps} onClose={() => setShowTutorial(false)} />
      )}
    </div>
  );
}
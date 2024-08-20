import React, { useState } from 'react';
import '../styles/Form.css';
import Select from 'react-select';
import { useForm, Controller } from 'react-hook-form';
import calculateTotalMemory from '../scripts/modelMemoryCalculation';
import CalculateButton from './CalculateButton';
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
          <label>Parameter count</label>
          <input type="text" {...register('paramCount')} />
        </div>
        <div className="formField">
          <label>Input size</label>
          <input type="text" {...register('inputSize')} />
        </div>
      </div>
      <div className="formRow">
        <div className="formField">
          <label>Batch size</label>
          <input type="text" {...register('batchSize')} />
        </div>
        <div className="formField checkboxField">
          <label>Training</label>
          <input type="checkbox" {...register('training')} />
        </div>
      </div>
      <div className="formRow">
        <div className="formField">
          <label>Weights precision</label>
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
        </div>
        <div className="formField">
          <label>Gradients Precision</label>
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
        </div>
      </div>
      <div className="formRow">
        <div className="formField">
          <label>Optimizer</label>
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
        </div>
      </div>

      {/* Calculate VRAM Button */}
      <div className="formActions">
        <CalculateButton onClick={handleSubmit(onSubmit)} />
      </div>

      {vramResult && (
        <div className="resultField">
          <p>Estimated VRAM: {vramResult} GB</p>
        </div>
      )}
    </form>
  );
}

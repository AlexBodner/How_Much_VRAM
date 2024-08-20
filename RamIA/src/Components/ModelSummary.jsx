import React, { useState } from 'react';
import '../styles/ModelSummary.css';
import Select from 'react-select';
import { useForm, Controller } from 'react-hook-form';
import calculateTotalMemory from '../scripts/modelMemoryCalculation';
import CalculateButton from './CalculateButton';

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
  const { register, handleSubmit, control } = useForm();
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
          <label>Model Summary</label>
          <textarea {...register('summary')} rows="10" cols="50" />
        </div>
        <div className="formField">
          <label>Library</label>
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
        </div>
        <div className="formField">
          <label>Input Shape</label>
          <input type="text" {...register('inputSize')} />
        </div>
        <div className="formField">
          <label>Batch Size</label>
          <input type="text" {...register('batchSize')} />
        </div>
        <div className="formField">
          <label>Weights Precision</label>
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

      {vramResult && (
        <div className="resultField">
          <p>Estimated VRAM: {vramResult} GB</p>
        </div>
      )}
    </form>
  );
}


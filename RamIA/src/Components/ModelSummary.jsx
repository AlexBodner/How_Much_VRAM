import React, { useState } from 'react';
import '../styles/ModelSummary.css';
import Select from 'react-select';
import { useForm, Controller } from 'react-hook-form';
import calculateTotalMemory from '../scripts/modelMemoryCalculation';

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
      <div className="formRow">
        <div className="formField">
          <label>Model Summary</label>
          <textarea type="text" {...register('summary')} rows="10" cols="50" />
        </div>
        <div className="formField">
          <label>Library</label>
          <Controller
            name="library"
            control={control}
            defaultValue={{ value: 'pytorch', label: 'Pytorch' }}
            render={({ field }) => (
              <Select
                {...field}
                options={libraryOptions}
                styles={customStyles}
              />
            )}
          />
        </div>
      </div>
      <div className="formRow">
        <div className="formField">
          <label>Input Shape</label>
          <input type="text" {...register('inputSize')} />
        </div>
        <div className="formField">
          <label>Batch Size</label>
          <input type="text" {...register('batchSize')} />
        </div>
      </div>
      <div className="formRow">
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
        <div className="formField checkboxField">
          <label>Training</label>
          <input type="checkbox" {...register('training')} />
        </div>
      </div>
      <div className="formRow">
        <button type="button" className="calculateButton" onClick={handleSubmit(onSubmit)}>
          Calculate VRAM
        </button>
      </div>
      {vramResult && (
        <div className="resultField">
          <p>Estimated VRAM: {vramResult} GB</p>
        </div>
      )}
    </form>
  );
}

import '../styles/Basic.css';
import Select from 'react-select';
import { useForm } from 'react-hook-form';
import calculateTotalMemory from '../scripts/modelMemoryCalculation';

export default function Form() {

    const { register, handleSubmit, errors } = useForm();

    const handleWriting = (e) => {
        if (e.target.value.length > 0) {
        }
    }

    const onSubmit = (data) => {
        var numero = calculateTotalMemory(data.paramCount, data.batchSize, data.InputShape, data.WeightsPrecision, data.GradientsPrecision, data.training, data.Optimizer);
        console.log(numero);
    }

    return (
            <form action='' className='form' onSubmit={handleSubmit(onSubmit)}>
                <div className='rowForm'>
                    <input type="text" placeholder="Parameter Count" className='inputForm' onChange={handleWriting} {...register('paramCount')} />
                    <input type="text" placeholder="Batch Size" className='inputForm' onChange={handleWriting} {...register('batchSize')} />
                </div>
                <div className='rowForm'>
                    <select className='inputForm' {...register('WeightsPrecision')}>
                        <option value="float64">Float64</option>
                        <option value="float32">Float32</option>
                        <option value="float16">Float16</option>
                        <option value="float8">Float8</option>
                        <option value="float4">Float4</option>
                    </select>
                    <input type="text" placeholder="Optimizer" className='inputForm' onChange={handleWriting} {...register('Optimizer')}/>
                </div>
                <div className='rowForm'>
                    <input type="text" placeholder="Input Size" className='inputForm' onChange={handleWriting} {...register('InputShape')}/>
                    <input type="text" placeholder="Training" className='inputForm' onChange={handleWriting} {...register('training')}/>
                </div>
                <div className='rowForm'>
                <select className='inputForm' {...register('GradientsPrecision')}>
                        <option value="float64">Float64</option>
                        <option value="float32">Float32</option>
                        <option value="float16">Float16</option>
                        <option value="float8">Float8</option>
                        <option value="float4">Float4</option>
                    </select>
                    <button type="submit" className='buttonForm'>
                        Send form    
                    </button>
                </div>
            </form>
    )
}
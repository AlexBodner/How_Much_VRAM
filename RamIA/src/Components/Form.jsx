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
            </div>
            <div className='rowForm'>
                <input type="text" placeholder="Batch size" className='inputForm' onChange={handleWriting} {...register('batchSize')} />
            </div>
            <div className='rowForm'>
                <input type="text" placeholder="Weights' precision" className='inputForm' onChange={handleWriting} {...register('paramCount')} />
            </div>
            <div className='rowForm'>
                <input type="text" placeholder="Parameter Count" className='inputForm' onChange={handleWriting} {...register('paramCount')} />
            </div>
            <div className='rowForm'>
                <input type="text" placeholder="Parameter Count" className='inputForm' onChange={handleWriting} {...register('paramCount')} />
            </div>
            <div className='rowForm'>
                <input type="text" placeholder="Parameter Count" className='inputForm' onChange={handleWriting} {...register('paramCount')} />
            </div>
            <div className='rowForm'>
                <input type="text" placeholder="Parameter Count" className='inputForm' onChange={handleWriting} {...register('paramCount')} />
            </div>
            <div className='rowForm'>
                <button type="submit" className='buttonForm'>
                    Send form
                </button>
            </div>

        </form>
    )
}
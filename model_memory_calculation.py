import optimizers_mem_usage 
import parse_pytorch
def calculate_memory_parameters(parameter_count):
    return parameter_count

def calculate_memory_gradients(memory_parameters,batch_size):
    return memory_parameters*batch_size

def calculate_input_usage(input_shape,batch_size):
    
    if type(input_shape)==list or type(input_shape)==tuple:
        aux = 1
        for i in input_shape:
            aux*=i
        return aux*batch_size#* (precision/8)/(1024*1024)
    elif type(input_shape)==int:     
        return input_shape*batch_size#* (precision/8)/(1024*1024)
def calculate_total_memory(parameter_count, batch_size,input_shape,precision ,optimizer = "adam",summary=None,library=None):
    activations_mem = 0
    if not summary is None and not library is None:
        if library=="pytorch":
            p = 0
            outs_params = parse_pytorch.parse_pytorch_summary(summary)
            for out_shape, params in outs_params:
                activations_mem+=out_shape
                p+=params
            parameter_count = p
        elif library=="tensorflow":
            pass
        elif library=="jax":
            pass
    optimizer_mem = optimizers_mem_usage.dict_mapper.get(optimizer,lambda x:0)(parameter_count)
    input_mem = calculate_input_usage(input_shape,batch_size)
    return  (parameter_count+optimizer_mem+input_mem+activations_mem)*precision /(8*1024*1024) #Conversion to MB

#def calculate_memory_from_torch(summary,precision)
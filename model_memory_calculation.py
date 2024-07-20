import optimizers_mem_usage 
import parse_pytorch
from transformer_memory import *

def bits_to_GB(b):
    return b/(8*1024**3) 
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
def calculate_total_memory(parameter_count, batch_size,input_shape,weight_precision,gradient_precision,training=True,optimizer = "adam",summary=None,library=None):
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
        activations_mem*= batch_size*gradient_precision/(8*1024**3) 
        # Calculate input usage in bits
        input_bits = calculate_input_usage(input_shape,batch_size)
        
        #Calculate gradients and optimizer memory
        optimizer_mem = optimizers_mem_usage.dict_mapper.get(optimizer,lambda x:0)(parameter_count)
        gradients_mem =( parameter_count+optimizer_mem) *int(training) *gradient_precision/(8*1024**3) 
        

        
        total_gb = bits_to_GB((parameter_count+input_bits)*weight_precision)  +gradients_mem +activations_mem
        return  total_gb+ 0.2*total_gb

if __name__=="__main__":
    summary_bigger_mlp = """----------------------------------------------------------------
        Layer (type)               Output Shape         Param #
================================================================
           Flatten-1                  [-1, 784]               0
            Linear-2                [-1, 10000]       7,850,000
            Linear-3                 [-1, 5000]      50,005,000
            Linear-4                 [-1, 1500]       7,501,500
            Linear-5                 [-1, 5000]       7,505,000
            Linear-6                 [-1, 5000]      25,005,000
            Linear-7                   [-1, 10]          50,010
================================================================
Total params: 97,916,510
Trainable params: 97,916,510
Non-trainable params: 0
----------------------------------------------------------------"""
    summary_super_mlp = """----------------------------------------------------------------
        Layer (type)               Output Shape         Param #
================================================================
           Flatten-1                  [-1, 784]               0
            Linear-2                [-1, 10000]       7,850,000
            Linear-3                [-1, 20000]     200,020,000
            Linear-4                [-1, 10000]     200,010,000
            Linear-5                 [-1, 5000]      50,005,000
            Linear-6                 [-1, 5000]      25,005,000
            Linear-7                   [-1, 10]          50,010
================================================================
Total params: 482,940,010
Trainable params: 482,940,010
Non-trainable params: 0
----------------------------------------------------------------
Input size (MB): 0.00
Forward/backward pass size (MB): 0.39
Params size (MB): 1842.27
Estimated Total Size (MB): 1842.66
----------------------------------------------------------------"""
    summary_big = """----------------------------------------------------------------
        Layer (type)               Output Shape         Param #
================================================================
           Flatten-1                  [-1, 784]               0
            Linear-2                 [-1, 1000]         785,000
            Linear-3                 [-1, 1500]       1,501,500
            Linear-4                 [-1, 1500]       2,251,500
            Linear-5                 [-1, 5000]       7,505,000
            Linear-6                 [-1, 5000]      25,005,000
            Linear-7                   [-1, 10]          50,010
================================================================
Total params: 37,098,010
Trainable params: 37,098,010
Non-trainable params: 0
----------------------------------------------------------------
Input size (MB): 0.00
Forward/backward pass size (MB): 0.11
Params size (MB): 141.52
Estimated Total Size (MB): 141.63
----------------------------------------------------------------"""
    summary_cnn ="""----------------------------------------------------------------
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
----------------------------------------------------------------
"""
    #Yolo
    #print(calculate_total_memory(None, 16,input_shape=(3,640,480),weight_precision=32,gradient_precision= 32 ,training=True,optimizer = "adam",summary=yolo,library="pytorch"))

    #CNN
    #print(calculate_total_memory(None, 64,input_shape=(1,28,28),weight_precision=32,gradient_precision= 32 ,training=True,optimizer = "adam",summary=summary_cnn,library="pytorch"))
    
    # Big MLP
    #print(calculate_total_memory(None, 64,input_shape=(1,28,28),weight_precision=32,gradient_precision= 32 ,training=True,optimizer = "adam",summary=summary_bigger_mlp,library="pytorch"))

    
    #Super MLP
    #print(calculate_total_memory(None, 64,input_shape=(1,28,28),weight_precision=32,gradient_precision= 32 ,training=True,optimizer = "adam",summary=summary_super_mlp,library="pytorch"))
    
    #GPT1B
    
    #print(calculate_total_memory(1.41e9, 1,input_shape=65536,weight_precision=16,gradient_precision= 32 ,training=True,optimizer = "adam",summary=None,library="pytorch")) # Expected: 68GB
    
    
    print(memory_llm(v= 50257,s=65536,h= 2048,hff=5440,a=1,batch_size=1,transformer_layers=24))

    
    print(memory_llm2(seq_length =65536 , batch_size=  1, hidden_dims=2048,heads=1,precision=32,layers= 24,parameters=1.41e9))
    #print(memory_llm2(seq_length =2048  , batch_size=  1, hidden_dims=4096 ,heads=32 ,precision=32,layers= 32 ,parameters=7e9))

    #print(calculate_vram_usage(vocab_size=50257, hidden_size= 2048, sequence_length=65536, num_layers = 24, batch_size=1, precision_bits=32))
    #GPT 5B
    #print(calculate_total_memory(5.23e9, 1,input_shape=4096,weight_precision=16,gradient_precision= 32 ,training=True,optimizer = "adam",summary=None,library="pytorch"))
    
    #print(memory_llm(v= 50257,s=65536/2,h= 4096,hff=10880,a=1,batch_size=1,transformer_layers=24))

    
#def calculate_memory_from_torch(summary,precision)



import re

def parse_tensorflow_summary(summary_str):
    layer_info = []
    capture = False
    for line in summary_str.split("\n"):
        if "Layer (type)" in line:
            capture = True
            continue
        if "Total params" in line:
            capture = False
        
        if capture:
            out_shape = re.findall(r'\(.*?\)', line)
            if out_shape:
                print(out_shape)
                out_shape = out_shape[-1][out_shape[-1].rindex('('):-1]  # Remove parentheses
                params = re.findall(r'\d+', line.split()[-1].replace(",", ""))
                print(params)
                params = int(params[0]) if params else 0
                out_size = 1
                for dim in out_shape.split(","):
                    print(dim)
                    if 'None' not in dim.strip():
                        out_size *= abs(int(dim))
                layer_info.append((out_size, params))

    return layer_info

# Example TensorFlow summary
tensorflow_summary = """
Model: "sequential_1"
_________________________________________________________________
 Layer (type)                Output Shape              Param #   
=================================================================
 conv2d (Conv2D)             (None, 30, 30, 32)        896       
                                                                 
 max_pooling2d (MaxPooling2  (None, 15, 15, 32)        0         
                                                                 
 conv2d_1 (Conv2D)           (None, 13, 13, 64)        18496     
                                                                 
 max_pooling2d_1 (MaxPoolin  (None, 6, 6, 64)          0         
 g2D)                                                            
                                                                 
 conv2d_2 (Conv2D)           (None, 4, 4, 64)          36928     
                                                                 
=================================================================
Total params: 56320 (220.00 KB)
Trainable params: 56320 (220.00 KB)
Non-trainable params: 0 (0.00 Byte)
____________________________________________
"""
if __name__=="__main":

    # Parse the example summary
    layer_info = parse_tensorflow_summary(tensorflow_summary)
    print(layer_info)
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
                out_shape = out_shape[-1][out_shape[-1].rindex('('):-1]  # Remove parentheses
                params = re.findall(r'\d+', line.replace("│","").split()[-1].replace(",", ""))
                params = int(params[0]) if params else 0
                out_size = 1
                for dim in out_shape.split(","):
                    stripped = dim.strip()
                    if 'None' not in stripped and stripped.isnumeric():
                        out_size *= abs(int(stripped))
                layer_info.append((out_size, params))

    return layer_info

# Example TensorFlow summary
summary_mlp= """Model: "sequential"
_________________________________________________________________
 Layer (type)                Output Shape              Param #   
=================================================================
 flatten (Flatten)           (None, 784)               0         
                                                                 
 dense (Dense)               (None, 128)               100480    
                                                                 
 dense_1 (Dense)             (None, 10)                1290      
                                                                 
=================================================================
Total params: 101770 (397.54 KB)
Trainable params: 101770 (397.54 KB)
Non-trainable params: 0 (0.00 Byte)
_________________________________________________________________"""

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
gpt_summary= """Model: "functional"
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━┓
┃ Layer (type)                         ┃ Output Shape                ┃         Param # ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━┩
│ input_layer (InputLayer)             │ (None, None)                │               0 │
├──────────────────────────────────────┼─────────────────────────────┼─────────────────┤
│ token_and_position_embedding         │ (None, None, 256)           │       1,312,768 │
│ (TokenAndPositionEmbedding)          │                             │                 │
├──────────────────────────────────────┼─────────────────────────────┼─────────────────┤
│ transformer_decoder                  │ (None, None, 256)           │         329,085 │
│ (TransformerDecoder)                 │                             │                 │
├──────────────────────────────────────┼─────────────────────────────┼─────────────────┤
│ transformer_decoder_1                │ (None, None, 256)           │         329,085 │
│ (TransformerDecoder)                 │                             │                 │
├──────────────────────────────────────┼─────────────────────────────┼─────────────────┤
│ dense (Dense)                        │ (None, None, 5000)          │       1,285,000 │
└──────────────────────────────────────┴─────────────────────────────┴─────────────────┘
 Total params: 3,255,938 (12.42 MB)
 Trainable params: 3,255,938 (12.42 MB)
 Non-trainable params: 0 (0.00 B)"""

gpt_summary2= """Model: "functional_1"
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━┓
┃ Layer (type)                         ┃ Output Shape                ┃         Param # ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━┩
│ input_layer (InputLayer)             │ (None, 80)                  │               0 │
├──────────────────────────────────────┼─────────────────────────────┼─────────────────┤
│ token_and_position_embedding         │ (None, 80, 256)             │       5,140,480 │
│ (TokenAndPositionEmbedding)          │                             │                 │
├──────────────────────────────────────┼─────────────────────────────┼─────────────────┤
│ transformer_block (TransformerBlock) │ (None, 80, 256)             │         658,688 │
├──────────────────────────────────────┼─────────────────────────────┼─────────────────┤
│ dense_2 (Dense)                      │ (None, 80, 20000)           │       5,140,000 │
└──────────────────────────────────────┴─────────────────────────────┴─────────────────┘"""
if __name__=="__main__":

    # Parse the example summary
    layer_info = parse_tensorflow_summary(tensorflow_summary)
    print(layer_info)

    print(parse_tensorflow_summary(summary_mlp))
    print(parse_tensorflow_summary(gpt_summary))
    print(parse_tensorflow_summary(gpt_summary2))
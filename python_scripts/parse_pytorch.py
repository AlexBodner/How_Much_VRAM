import re

def parse_pytorch_summary(summary_str):
    layer_info = []
    capture = False
    for line in summary_str.split("\n"):
        if "Layer (type)" in line:
            capture = True
            continue
        if "Total params" in line:
            capture = False
#        print("spl",line.split(" "))
        out_shape = re.findall(r'\[.*?\]', line)
        if out_shape!=None and out_shape!=[]:
            params = int(line.split(" ")[-1].replace(",",""))
            out_shape= out_shape[0][1:-1]
            out_size = 1
            for i in out_shape.split(","):
                out_size*= abs(int(i))
            layer_info.append(( out_size, params))

    return layer_info

# Sample PyTorch summary string
pytorch_summary_str = """----------------------------------------------------------------
        Layer (type)               Output Shape         Param #
================================================================
            Conv2d-1            [-1, 5, 28, 28]              50
         MaxPool2d-2            [-1, 5, 14, 14]               0
            Conv2d-3            [-1, 5, 14, 14]             230
         MaxPool2d-4              [-1, 5, 7, 7]               0
           Flatten-5                  [-1, 245]               0
            Linear-6                   [-1, 10]           2,460
================================================================
Total params: 2,740
Trainable params: 2,740
Non-trainable params: 0
----------------------------------------------------------------
Input size (MB): 0.00
Forward/backward pass size (MB): 0.05
Params size (MB): 0.01
Estimated Total Size (MB): 0.06
----------------------------------------------------------------
"""

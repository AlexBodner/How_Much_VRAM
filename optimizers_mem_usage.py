def adam_mem_usage(gradients_mem):
    return gradients_mem*2
def sgd_mem_usage(gradients_mem):
    return 0
def momentum_usage(gradients_mem):
    return gradients_mem #osea que duplica el uso

def adagrad_usage(gradients_mem):
    return gradients_mem

def adadelta_usage(gradients_mem):
    return gradients_mem


def rmsprop_usage(gradients_mem):
    return gradients_mem

dict_mapper = {"adam":adam_mem_usage,"sgd":sgd_mem_usage,"momentum":momentum_usage,"adagrad":adagrad_usage,
               "adadelta":adadelta_usage,"rmsprop":rmsprop_usage}
def calculate_memory(parameter_count, precision,batch_size,training= True):
    precision_bytes = precision/8
    return parameter_count*precision_bytes*batch_size*(int(training)+1)
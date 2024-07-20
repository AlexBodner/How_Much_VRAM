
def memory_llm(v,s,h,hff,a,batch_size,transformer_layers):
    M_activation = (s*h*batch_size*transformer_layers*(16 + 8 *hff/h +5* a*s/h)+2*s*batch_size*h + 4*s*batch_size*v)/(1024**3)
    return M_activation

def memory_llm2(seq_length, batch_size , hidden_dims,heads,precision,layers,parameters):
    #https://medium.com/@siddheshgunjal82/understanding-vram-requirements-to-train-inference-with-large-language-models-llms-a3edd0f09d9f
    #activations_per_layer = seq_length*batch_size*hidden_dims*(34 +((5*heads*seq_length)/hidden_dims))
    activations = layers * (5/2)*heads*batch_size*(seq_length**2) + 17*batch_size*hidden_dims*seq_length
    #print("activ",activations)
    #259979739136.0
    #print( 11365145165824/ (8*1024**3))
    return precision * (activations + parameters) / (8*1024**3)
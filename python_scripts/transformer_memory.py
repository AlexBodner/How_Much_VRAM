#Credits https://github.com/EleutherAI/cookbook/tree/main/calc
import math

# Helper function to pretty-print message sizes
def convert_params(params):
    if params == 0:
        return "0"
    size_name = ("", "K", "M", "B", "T", "P", "E", "Z", "Y")
    i = int(math.floor(math.log(params, 1000)))
    p = math.pow(1000, i)
    s = round(params / p, 2)
    return "%s %s" % (s, size_name[i])

# Calculates the total memory necessary for model training or inference
def llm_calc_mem(num_gpus=1, tensor_parallel_size=1, pipeline_parallel_size=1, partition_activations=False, zero_stage=1, zero_allgather_bucket_size=5e8,
             zero3_max_live_params=1e9, checkpoint_activations=False, batch_size_per_gpu=1, sequence_length=2048, vocab_size=51200, hidden_size=6144,
             num_attention_heads=64, num_layers=44, ffn_size=6144*4, infer=False, kv_size_ratio=1.0, is_mixed_precision=True, high_prec_bytes_per_val=4,
             low_prec_bytes_per_val=2, bytes_per_grad_ele=4, num_experts=0, expert_parallelism=1, misc_mem_gib=0):
    
    dp_degree = num_gpus / (tensor_parallel_size * pipeline_parallel_size)

    # Compute total parameters from the config
    embed_params = 2 * vocab_size * hidden_size
    positional_params = hidden_size * sequence_length
    ln_params = 8 * hidden_size * num_layers + (2 * hidden_size)
    attention_params = int(2 * (1 + kv_size_ratio) * num_layers * hidden_size * hidden_size)
    mlp_params = 2 * num_layers * hidden_size * ffn_size 
    total_params = embed_params + positional_params + ln_params + attention_params + mlp_params

    # --- MODEL MEMORY ---
    # 4 bytes in fp32, 2 bytes in fp16/bf16, 1 byte in fp8
    if is_mixed_precision:
        bytes_per_param = low_prec_bytes_per_val
    else:
        bytes_per_param = high_prec_bytes_per_val

    # Compute memory from param calculation and parallelism settings
    model_mem = total_params * bytes_per_param
    per_gpu_model_mem = model_mem
    if num_experts > 0:
        total_moe_params = embed_params + positional_params + ln_params + attention_params + (num_experts * mlp_params)
    # Split the model with 3D parallelism
    if num_experts == 0:
        per_gpu_model_mem = (total_params * bytes_per_param) / (tensor_parallel_size * pipeline_parallel_size)
    else:
        EP_total_params = embed_params + positional_params + ln_params + attention_params + ((num_experts/expert_parallelism) * mlp_params)
        per_gpu_model_mem = (EP_total_params * bytes_per_param) / (tensor_parallel_size * pipeline_parallel_size)
    # ZeRO stage 3 shards the model parameters across GPUs (plus the gradients and optimizer states)
    if zero_stage == 3:
        per_gpu_model_mem /= num_gpus

    # --- GRADIENT MEMORY ---
    # E.g. 4 bytes in fp32, 2 bytes in fp16/bf16, 1 byte in fp8
    # Gradient precision is sometimes configurable in training frameworks.
    # Since high batch size means many accumulations, higher precision grads may reduce grad overflow.
    bytes_per_grad_element = bytes_per_grad_ele

    if num_experts > 0:
        gradient_mem = EP_total_params * bytes_per_grad_element
    else:
        gradient_mem = total_params * bytes_per_grad_element
    per_gpu_gradient_mem = gradient_mem
    # ZeRO stage 2 shards the gradients across GPUs (plus the optimizer states)
    if zero_stage >= 2:
        per_gpu_gradient_mem /= num_gpus

    # --- OPTIMIZER MEMORY ---
    # For mixed-precision Adam/AdamW, the optimizer must store fp32 copies of the parameters, momentum, and variance (4 + 4 + 4 = 12 bytes per optimizer parameter)
    # Feel free to change the multiplier for your optimizer (examples include SGD (4 + 4 = 8) and 8-bit ADAM (2 + 2 + 2 = 6)
    if num_experts > 0:
        optimizer_mem = EP_total_params * 12
    else:
        optimizer_mem = total_params * 12
    per_gpu_optimizer_mem = optimizer_mem
    # ZeRO stage 3 shards the optimizer states across GPUs
    if zero_stage >= 1:
        per_gpu_optimizer_mem /= num_gpus

    # --- COMMUNICATION MEMORY ---
    # Temporary GPU storage for communication buffers may become significant
    per_gpu_communication_mem = 0
    # The size of the communication buffer DeepSpeed uses to store ZeRO optimizer elements
    if zero_stage >= 1 and num_gpus > 1:
        per_gpu_communication_mem += zero_allgather_bucket_size * bytes_per_param
    # The number of parameters ZeRO-3 keeps alive in GPU memory at a time
    if zero_stage == 3 and num_gpus > 1:
        per_gpu_communication_mem += zero3_max_live_params * bytes_per_param

    # --- ACTIVATION MEMORY ---
    # Taken from Table 2 in https://arxiv.org/pdf/1910.02054.pdf and generalized to any precision (instead of just fp16 from the paper)
    # 3 cases: [training with activation checkpointing, training without activation checkpointing, inferencing]
    if not infer and checkpoint_activations:
        activation_mem = sequence_length * batch_size_per_gpu * hidden_size * num_layers * ((16 * low_prec_bytes_per_val + 2))
    elif not infer and not checkpoint_activations:
        activation_mem = sequence_length * batch_size_per_gpu * hidden_size * num_layers * ((16 * low_prec_bytes_per_val + 2) + (2 * low_prec_bytes_per_val + 1) * (num_attention_heads * sequence_length / hidden_size))
    # If using inference, assume just a single layer's activation memory at peak
    elif infer:
        activation_mem = sequence_length * batch_size_per_gpu * hidden_size * ((16 * low_prec_bytes_per_val + 2))
    per_gpu_activation_mem = activation_mem
    # DeepSpeed's ZeRO-R partitions activation memory across tensor-parallel GPUs
    if partition_activations:
        per_gpu_activation_mem = activation_mem / tensor_parallel_size

    # --- KV CACHE MEMORY (IF INFERENCE) ---
    if infer:
        # See https://kipp.ly/transformer-inference-arithmetic/ for details
        bytes_per_param = low_prec_bytes_per_val
        per_gpu_kv_cache_mem = bytes_per_param * 2 * num_layers * num_attention_heads * (hidden_size / num_attention_heads) * sequence_length
        kv_cache_mem = num_gpus * per_gpu_kv_cache_mem

    gradient_mem_gib = gradient_mem / 1024**3
    activation_mem_gib = activation_mem / 1024**3
    model_mem_gib = model_mem / 1024**3
    optimizer_mem_gib = optimizer_mem / 1024**3

    per_gpu_gradient_mem_gib = per_gpu_gradient_mem / 1024**3
    per_gpu_activation_mem_gib = per_gpu_activation_mem / 1024**3
    per_gpu_model_mem_gib = per_gpu_model_mem / 1024**3
    per_gpu_optimizer_mem_gib = per_gpu_optimizer_mem / 1024**3
    per_gpu_communication_mem_gib = per_gpu_communication_mem / 1024**3

    # We include a "Miscellaneous Memory" per GPU term because we find some 3D-parallel frameworks add a constant memory overhead (~5GiB in our experiments with Megatron-DeepSpeed) that we cannot explain. If you know the source of this, add a comment!
    if infer:
        kv_cache_mem_gib = kv_cache_mem / 1024**3
        per_gpu_kv_cache_mem_gib = per_gpu_kv_cache_mem / 1024**3

    if infer:
        per_gpu_mem_gib = per_gpu_activation_mem_gib + per_gpu_kv_cache_mem_gib + per_gpu_model_mem_gib + misc_mem_gib
        single_replica_mem_gib = activation_mem_gib + kv_cache_mem_gib + model_mem_gib + misc_mem_gib * num_gpus
    else:
        per_gpu_mem_gib = per_gpu_activation_mem_gib + per_gpu_gradient_mem_gib + per_gpu_model_mem_gib + per_gpu_optimizer_mem_gib + per_gpu_communication_mem_gib + misc_mem_gib
        single_replica_mem_gib = activation_mem_gib + gradient_mem_gib + model_mem_gib + optimizer_mem_gib + misc_mem_gib * num_gpus


    return single_replica_mem_gib


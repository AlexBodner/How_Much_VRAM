function llm_calc_mem({
    num_gpus = 1, tensor_parallel_size = 1, pipeline_parallel_size = 1, partition_activations = false, zero_stage = 1, zero_allgather_bucket_size = 5e8,
    zero3_max_live_params = 1e9, checkpoint_activations = false, batch_size_per_gpu = 1, sequence_length = 2048, vocab_size = 51200, hidden_size = 6144,
    num_attention_heads = 64, num_layers = 44, ffn_size = 6144 * 4, infer = false, kv_size_ratio = 1.0, is_mixed_precision = true, high_prec_bytes_per_val = 4,
    low_prec_bytes_per_val = 2, bytes_per_grad_ele = 4, num_experts = 0, expert_parallelism = 1, misc_mem_gib = 0
} = {}) {
    let dp_degree = num_gpus / (tensor_parallel_size * pipeline_parallel_size);

    let embed_params = 2 * vocab_size * hidden_size;
    let positional_params = hidden_size * sequence_length;
    let ln_params = 8 * hidden_size * num_layers + (2 * hidden_size);
    let attention_params = Math.floor(2 * (1 + kv_size_ratio) * num_layers * hidden_size * hidden_size);
    let mlp_params = 2 * num_layers * hidden_size * ffn_size;
    let total_params = embed_params + positional_params + ln_params + attention_params + mlp_params;

    let bytes_per_param = is_mixed_precision ? low_prec_bytes_per_val : high_prec_bytes_per_val;

    let model_mem = total_params * bytes_per_param;
    let per_gpu_model_mem = model_mem;

    if (num_experts > 0) {
        var total_moe_params = embed_params + positional_params + ln_params + attention_params + (num_experts * mlp_params);
    }

    if (num_experts === 0) {
        per_gpu_model_mem = (total_params * bytes_per_param) / (tensor_parallel_size * pipeline_parallel_size);
    } else {
        let EP_total_params = embed_params + positional_params + ln_params + attention_params + ((num_experts / expert_parallelism) * mlp_params);
        per_gpu_model_mem = (EP_total_params * bytes_per_param) / (tensor_parallel_size * pipeline_parallel_size);
    }

    if (zero_stage === 3) {
        per_gpu_model_mem /= num_gpus;
    }

    let bytes_per_grad_element = bytes_per_grad_ele;

    let gradient_mem;
    if (num_experts > 0) {
        gradient_mem = EP_total_params * bytes_per_grad_element;
    } else {
        gradient_mem = total_params * bytes_per_grad_element;
    }
    let per_gpu_gradient_mem = gradient_mem;

    if (zero_stage >= 2) {
        per_gpu_gradient_mem /= num_gpus;
    }

    let optimizer_mem;
    if (num_experts > 0) {
        optimizer_mem = EP_total_params * 12;
    } else {
        optimizer_mem = total_params * 12;
    }
    let per_gpu_optimizer_mem = optimizer_mem;

    if (zero_stage >= 1) {
        per_gpu_optimizer_mem /= num_gpus;
    }

    let per_gpu_communication_mem = 0;

    if (zero_stage >= 1 && num_gpus > 1) {
        per_gpu_communication_mem += zero_allgather_bucket_size * bytes_per_param;
    }

    if (zero_stage === 3 && num_gpus > 1) {
        per_gpu_communication_mem += zero3_max_live_params * bytes_per_param;
    }

    let activation_mem;
    if (!infer && checkpoint_activations) {
        activation_mem = sequence_length * batch_size_per_gpu * hidden_size * num_layers * ((16 * low_prec_bytes_per_val + 2));
    } else if (!infer && !checkpoint_activations) {
        activation_mem = sequence_length * batch_size_per_gpu * hidden_size * num_layers * ((16 * low_prec_bytes_per_val + 2) + (2 * low_prec_bytes_per_val + 1) * (num_attention_heads * sequence_length / hidden_size));
    } else if (infer) {
        activation_mem = sequence_length * batch_size_per_gpu * hidden_size * ((16 * low_prec_bytes_per_val + 2));
    }
    let per_gpu_activation_mem = activation_mem;

    if (partition_activations) {
        per_gpu_activation_mem = activation_mem / tensor_parallel_size;
    }

    let per_gpu_kv_cache_mem;
    let kv_cache_mem;
    if (infer) {
        per_gpu_kv_cache_mem = low_prec_bytes_per_val * 2 * num_layers * num_attention_heads * (hidden_size / num_attention_heads) * sequence_length;
        kv_cache_mem = num_gpus * per_gpu_kv_cache_mem;
    }

    let gradient_mem_gib = gradient_mem / (1024 ** 3);
    let activation_mem_gib = activation_mem / (1024 ** 3);
    let model_mem_gib = model_mem / (1024 ** 3);
    let optimizer_mem_gib = optimizer_mem / (1024 ** 3);

    let per_gpu_gradient_mem_gib = per_gpu_gradient_mem / (1024 ** 3);
    let per_gpu_activation_mem_gib = per_gpu_activation_mem / (1024 ** 3);
    let per_gpu_model_mem_gib = per_gpu_model_mem / (1024 ** 3);
    let per_gpu_optimizer_mem_gib = per_gpu_optimizer_mem / (1024 ** 3);
    let per_gpu_communication_mem_gib = per_gpu_communication_mem / (1024 ** 3);


    let per_gpu_mem_gib;
    let single_replica_mem_gib;

    if (infer) {
        let kv_cache_mem_gib = kv_cache_mem / (1024 ** 3);
        let per_gpu_kv_cache_mem_gib = per_gpu_kv_cache_mem / (1024 ** 3);
        per_gpu_mem_gib = per_gpu_activation_mem_gib + per_gpu_kv_cache_mem_gib + per_gpu_model_mem_gib + misc_mem_gib;
        single_replica_mem_gib = activation_mem_gib + kv_cache_mem_gib + model_mem_gib + misc_mem_gib * num_gpus;
    } else {
        per_gpu_mem_gib = per_gpu_activation_mem_gib + per_gpu_gradient_mem_gib + per_gpu_model_mem_gib + per_gpu_optimizer_mem_gib + per_gpu_communication_mem_gib + misc_mem_gib;
        single_replica_mem_gib = activation_mem_gib + gradient_mem_gib + model_mem_gib + optimizer_mem_gib + misc_mem_gib * num_gpus;
    }

    return single_replica_mem_gib;
}

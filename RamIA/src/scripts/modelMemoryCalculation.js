//import { dict_mapper } from './optimizersMemUsage';
import { act } from 'react';
import { parsePytorchSummary } from './parsers';
//const parsePytorchSummary = ( import('./parsers.js')).default;

function bitsToGB(b) {
    return b / (8 * 1024 **3);
}

function calculateMemoryParameters(parameterCount) {
    return parameterCount;
}

function calculateMemoryGradients(memoryParameters, batchSize) {
    return memoryParameters * batchSize;
}

function calculateInputUsage(inputShape, batchSize) {
    if (Array.isArray(eval(inputShape))) {
        let aux = 1;

        let arr = JSON.parse(inputShape)
        for (var i = 0; i < arr.length; i++) {
            aux*=arr[i]

          }

        return aux * batchSize;
    } else if (/^[0-9]+$/.test(inputShape)) {
        console.log("a"+inputShape)

        return inputShape * batchSize;
    }
    
}

export default function calculateTotalMemory(parameterCount, batchSize, inputShape, weightPrecisionString, gradientPrecisionString, training, optimizer, summary, library) {
    let activationsMem = 0;
    console.log(gradientPrecisionString)
    let gradientPrecision = gradientPrecisionString.substring(5, gradientPrecisionString.length);
    let weightPrecision = weightPrecisionString.substring(5, weightPrecisionString.length);

    if (summary !== undefined && library !== undefined) {
        console.log("entra a parser"+library);
        if (library === "pytorch") {
            let p = 0;
            let outsParams = parsePytorchSummary(summary);
            console.log(outsParams)
            outsParams.forEach(([outShape, params]) => {
                activationsMem += outShape;
                p += params;
            });
            parameterCount = p;
        } else if (library === "tensorflow") {
            // Handle TensorFlow case
        } else if (library === "jax") {
            // Handle JAX case
        }
    }

    activationsMem *= batchSize * gradientPrecision;
    activationsMem = bitsToGB(activationsMem)
    let input_mem = bitsToGB(calculateInputUsage(inputShape, batchSize))*weightPrecision;
    let optimizerMem = dict_mapper[optimizer](parameterCount);
    console.log(weightPrecision)

    var parameters_mem = bitsToGB(parameterCount)*weightPrecision;
    
    var gradientsMem = training ?  (bitsToGB(parameterCount) + bitsToGB( optimizerMem)) * gradientPrecision : 0;

    let totalGB = parameters_mem + input_mem+ gradientsMem + activationsMem;
    console.log(totalGB)
    return totalGB + 0.2 * totalGB;
}

//OTRO SCRIPT

function adamMemUsage(gradientsMem) {
    return gradientsMem * 2;
}

function sgdMemUsage(gradientsMem) {
    return 0;
}

function momentumUsage(gradientsMem) {
    return gradientsMem; // Duplicates the usage
}

function adagradUsage(gradientsMem) {
    return gradientsMem;
}

function adadeltaUsage(gradientsMem) {
    return gradientsMem;
}

function rmspropUsage(gradientsMem) {
    return gradientsMem;
}

const dict_mapper = {
    "adam": adamMemUsage,
    "sgd": sgdMemUsage,
    "momentum": momentumUsage,
    "adagrad": adagradUsage,
    "adadelta": adadeltaUsage,
    "rmsprop": rmspropUsage
};


//OTRO SCRIPT


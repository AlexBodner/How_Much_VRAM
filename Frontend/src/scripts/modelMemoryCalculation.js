//import { dict_mapper } from './optimizersMemUsage';
import { act } from 'react';
import { parsePytorchSummary,parseTensorflowSummary } from './parsers';
import {dict_mapper} from './optimizersMemUsage';

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
function extractSummaryInfo(lib_func,summary){
    let parameterCount = 0;
    let activationsMem = 0;

    let outsParams = lib_func(summary);
    console.log(outsParams)
    outsParams.forEach(([outShape, params]) => {
        activationsMem += outShape;
        parameterCount += params;
    });
    console.log(parameterCount+ " "+activationsMem)
    return [parameterCount,activationsMem]
}

export default function calculateTotalMemory(parameterCount, batchSize, inputShape, weightPrecisionString, gradientPrecisionString, training, optimizer, summary, library) {
    let gradientPrecision = gradientPrecisionString.substring(5, gradientPrecisionString.length);
    let weightPrecision = weightPrecisionString.substring(5, weightPrecisionString.length);
    let activationsMem = 0
    let out = []
    if (summary !== undefined && library !== undefined) {
        console.log("entra a parser "+library);
        if (library === "pytorch") {
            out =  extractSummaryInfo(parsePytorchSummary,summary)


        } else if (library === "tensorflow") {
            out =  extractSummaryInfo(parseTensorflowSummary,summary)
            console.log(out)
        } else if (library === "jax") {
            // Handle JAX case
        }
        parameterCount = out[0]
        activationsMem = out[1]
    }
    console.log(parameterCount+ " "+activationsMem)

    activationsMem *= batchSize * gradientPrecision;
    activationsMem = bitsToGB(activationsMem)
    let input_mem = bitsToGB(calculateInputUsage(inputShape, batchSize))*weightPrecision;
    let optimizerMem = dict_mapper[optimizer](parameterCount);

    var parameters_mem = bitsToGB(parameterCount)*weightPrecision;
    
    var gradientsMem = training ?  (bitsToGB(parameterCount) + bitsToGB( optimizerMem)) * gradientPrecision : 0;

    let totalGB = parameters_mem + input_mem+ gradientsMem + activationsMem;
    console.log(totalGB)
    return totalGB + 0.2 * totalGB + 0.2;//torch for example seems to use 200 MB independent of the model
}



//OTRO SCRIPT


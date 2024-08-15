//import { dict_mapper } from './optimizersMemUsage';
//import { parsePytorchSummary } from './parsers';

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
    if (Array.isArray(inputShape)) {
        let aux = 1;
        inputShape.forEach(i => aux *= i);
        return aux * batchSize;
    } else if (/^[0-9]+$/.test(inputShape)) {
        return inputShape * batchSize;
    }
}

export default function calculateTotalMemory(parameterCount, batchSize, inputShape, weightPrecisionString, gradientPrecisionString, training, optimizer, summary, library) {
    let activationsMem = 0;
    let gradientPrecision = gradientPrecisionString.substring(5, gradientPrecisionString.length);
    let weightPrecision = weightPrecisionString.substring(5, weightPrecisionString.length);

    if (summary !== undefined && library !== undefined) {
        console.log("entra a parser");
        if (library === "pytorch") {
            let p = 0;
            let outsParams = parsePytorchSummary(summary);
            outsParams.forEach(([outShape, params]) => {
                activationsMem += outShape;
                p += params;
            });
            parameterCount = p;
            console.log(totalGB + 0.2 * totalGB);
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

    var parameters_mem = bitsToGB(parameterCount)*weightPrecision;
    
    var gradientsMem = training ?  (bitsToGB(parameterCount) + bitsToGB( optimizerMem)) * gradientPrecision : 0;

    let totalGB = parameters_mem +input_mem+ gradientsMem + activationsMem;

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

function parsePytorchSummary(summaryStr) {
    const layerInfo = [];
    let capture = false;
    const lines = summaryStr.split("\n");

    lines.forEach(line => {
        if (line.includes("Layer (type)")) {
            capture = true;
            return;
        }
        if (line.includes("Total params")) {
            capture = false;
        }

        const outShapeMatches = line.match(/\[.*?\]/);
        if (outShapeMatches !== null && outShapeMatches.length > 0) {
            const params = parseInt(line.split(" ").slice(-1)[0].replace(/,/g, ""), 10);
            const outShape = outShapeMatches[0].slice(1, -1);
            let outSize = 1;
            outShape.split(",").forEach(dim => {
                outSize *= Math.abs(parseInt(dim, 10));
            });
            layerInfo.push([outSize, params]);
        }
    });

    return layerInfo;
}
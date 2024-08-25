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

export const dict_mapper = {
    "adam": adamMemUsage,
    "sgd": sgdMemUsage,
    "momentum": momentumUsage,
    "adagrad": adagradUsage,
    "adadelta": adadeltaUsage,
    "rmsprop": rmspropUsage
};

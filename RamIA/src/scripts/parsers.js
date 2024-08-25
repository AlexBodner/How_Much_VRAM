export  function parsePytorchSummary(summaryStr) {
    const layerInfo = [];
    let capture = false;
    const lines = summaryStr.split("\n");
    lines.forEach(line => {
        console.log("line"+ line);
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

export function parseTensorflowSummary(summaryStr) {
    const layerInfo = [];
    let capture = false;
    const lines = summaryStr.split('\n');

    for (const line of lines) {
        if (line.includes('Layer (type)')) {
            capture = true;
            continue;
        }
        if (line.includes('Total params')) {
            break;
        }

        if (capture) {
            const parts = line.split('│').filter(part => part.trim());
            if (parts.length >= 3   ) {
                const outShapeStr = parts[1].trim();
                const paramsStr = parts[2].trim().replace(',', '').replace(',', ''); //Seem to be 2 different commas LOL
                console.log("str"+paramsStr," "+parseInt(paramsStr))
                const outShape = outShapeStr.match(/\((.*?)\)/);
                const params = parseInt(paramsStr.match(/\d+/)?.[0] || '0');

                if (outShape) {
                    const dimensions = outShape[1].split(',');
                    let outSize = 1;
                    for (const dim of dimensions) {
                        const stripped = dim.trim();
                        if (stripped !== 'None' && !isNaN(stripped)) {
                            outSize *= Math.abs(parseInt(stripped));
                        }
                    }
                    layerInfo.push([outSize, params]);
                }
            }
        }
    }

    return layerInfo;
}

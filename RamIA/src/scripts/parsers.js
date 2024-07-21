export default function parsePytorchSummary(summaryStr) {
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
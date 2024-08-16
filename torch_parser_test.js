// Use dynamic import to load the ES module
(async () => {
    const parsePytorchSummary = (await import('./RamIA/src/scripts/parsers.js')).default;

    // List of summaries to test
    const testCases = [
        {
            summary: `
            ----------------------------------------------------------------
                    Layer (type)               Output Shape         Param #
            ================================================================
                        Conv2d-1            [-1, 5, 28, 28]              50
                     MaxPool2d-2            [-1, 5, 14, 14]               0
                        Conv2d-3            [-1, 5, 14, 14]             230
                     MaxPool2d-4              [-1, 5, 7, 7]               0
                       Flatten-5                  [-1, 245]               0
                        Linear-6                   [-1, 10]           2,460
            ================================================================
            Total params: 2,740
            Trainable params: 2,740
            Non-trainable params: 0
            ----------------------------------------------------------------
            Input size (MB): 0.00
            Forward/backward pass size (MB): 0.05
            Params size (MB): 0.01
            Estimated Total Size (MB): 0.06
            ----------------------------------------------------------------
            `,
            expected: [
                [3920, 50],    // Conv2d-1: Output Size 3920, Params 50
                [980, 0],      // MaxPool2d-2: Output Size 980, Params 0
                [980, 230],    // Conv2d-3: Output Size 980, Params 230
                [245, 0],      // MaxPool2d-4: Output Size 245, Params 0
                [245, 0],      // Flatten-5: Output Size 245, Params 0
                [10, 2460],    // Linear-6: Output Size 10, Params 2460
            ]
        },
        {
            summary: `----------------------------------------------------------------
        Layer (type)               Output Shape         Param #
================================================================
            Conv2d-1         [-1, 64, 224, 224]           1,792
              ReLU-2         [-1, 64, 224, 224]               0
            Conv2d-3         [-1, 64, 224, 224]          36,928
              ReLU-4         [-1, 64, 224, 224]               0
         MaxPool2d-5         [-1, 64, 112, 112]               0
            Conv2d-6        [-1, 128, 112, 112]          73,856
              ReLU-7        [-1, 128, 112, 112]               0
            Conv2d-8        [-1, 128, 112, 112]         147,584
              ReLU-9        [-1, 128, 112, 112]               0
        MaxPool2d-10          [-1, 128, 56, 56]               0
           Conv2d-11          [-1, 256, 56, 56]         295,168
             ReLU-12          [-1, 256, 56, 56]               0
           Conv2d-13          [-1, 256, 56, 56]         590,080
             ReLU-14          [-1, 256, 56, 56]               0
           Conv2d-15          [-1, 256, 56, 56]         590,080
             ReLU-16          [-1, 256, 56, 56]               0
        MaxPool2d-17          [-1, 256, 28, 28]               0
           Conv2d-18          [-1, 512, 28, 28]       1,180,160
             ReLU-19          [-1, 512, 28, 28]               0
           Conv2d-20          [-1, 512, 28, 28]       2,359,808
             ReLU-21          [-1, 512, 28, 28]               0
           Conv2d-22          [-1, 512, 28, 28]       2,359,808
             ReLU-23          [-1, 512, 28, 28]               0
        MaxPool2d-24          [-1, 512, 14, 14]               0
           Conv2d-25          [-1, 512, 14, 14]       2,359,808
             ReLU-26          [-1, 512, 14, 14]               0
           Conv2d-27          [-1, 512, 14, 14]       2,359,808
             ReLU-28          [-1, 512, 14, 14]               0
           Conv2d-29          [-1, 512, 14, 14]       2,359,808
             ReLU-30          [-1, 512, 14, 14]               0
        MaxPool2d-31            [-1, 512, 7, 7]               0
           Linear-32                 [-1, 4096]     102,764,544
             ReLU-33                 [-1, 4096]               0
          Dropout-34                 [-1, 4096]               0
           Linear-35                 [-1, 4096]      16,781,312
             ReLU-36                 [-1, 4096]               0
          Dropout-37                 [-1, 4096]               0
           Linear-38                 [-1, 1000]       4,097,000
================================================================
Total params: 138,357,544
Trainable params: 138,357,544
Non-trainable params: 0
----------------------------------------------------------------
Input size (MB): 0.57
Forward/backward pass size (MB): 218.59
Params size (MB): 527.79
Estimated Total Size (MB): 746.96
----------------------------------------------------------------
            `,
            expected: [
                [3211264, 1792],      // Conv2d-1: Output Size 64 * 224 * 224, Params 1792
                [3211264, 0],         // ReLU-2: Output Size 64 * 224 * 224, Params 0
                [3211264, 36928],     // Conv2d-3: Output Size 64 * 224 * 224, Params 36928
                [3211264, 0],         // ReLU-4: Output Size 64 * 224 * 224, Params 0
                [802816, 0],          // MaxPool2d-5: Output Size 64 * 112 * 112, Params 0
                [1605632, 73856],     // Conv2d-6: Output Size 128 * 112 * 112, Params 73856
                [1605632, 0],         // ReLU-7: Output Size 128 * 112 * 112, Params 0
                [1605632, 147584],    // Conv2d-8: Output Size 128 * 112 * 112, Params 147584
                [1605632, 0],         // ReLU-9: Output Size 128 * 112 * 112, Params 0
                [401408, 0],          // MaxPool2d-10: Output Size 128 * 56 * 56, Params 0
                [802816, 295168],     // Conv2d-11: Output Size 256 * 56 * 56, Params 295168
                [802816, 0],          // ReLU-12: Output Size 256 * 56 * 56, Params 0
                [802816, 590080],     // Conv2d-13: Output Size 256 * 56 * 56, Params 590080
                [802816, 0],          // ReLU-14: Output Size 256 * 56 * 56, Params 0
                [802816, 590080],     // Conv2d-15: Output Size 256 * 56 * 56, Params 590080
                [802816, 0],          // ReLU-16: Output Size 256 * 56 * 56, Params 0
                [200704, 0],          // MaxPool2d-17: Output Size 256 * 28 * 28, Params 0
                [401408, 1180160],    // Conv2d-18: Output Size 512 * 28 * 28, Params 1180160
                [401408, 0],          // ReLU-19: Output Size 512 * 28 * 28, Params 0
                [401408, 2359808],    // Conv2d-20: Output Size 512 * 28 * 28, Params 2359808
                [401408, 0],          // ReLU-21: Output Size 512 * 28 * 28, Params 0
                [401408, 2359808],    // Conv2d-22: Output Size 512 * 28 * 28, Params 2359808
                [401408, 0],          // ReLU-23: Output Size 512 * 28 * 28, Params 0
                [100352, 0],          // MaxPool2d-24: Output Size 512 * 14 * 14, Params 0
                [100352, 2359808],    // Conv2d-25: Output Size 512 * 14 * 14, Params 2359808
                [100352, 0],          // ReLU-26: Output Size 512 * 14 * 14, Params 0
                [100352, 2359808],    // Conv2d-27: Output Size 512 * 14 * 14, Params 2359808
                [100352, 0],          // ReLU-28: Output Size 512 * 14 * 14, Params 0
                [100352, 2359808],    // Conv2d-29: Output Size 512 * 14 * 14, Params 2359808
                [100352, 0],          // ReLU-30: Output Size 512 * 14 * 14, Params 0
                [25088, 0],           // MaxPool2d-31: Output Size 512 * 7 * 7, Params 0
                [4096, 102764544],    // Linear-32: Output Size 4096, Params 102764544
                [4096, 0],            // ReLU-33: Output Size 4096, Params 0
                [4096, 0],            // Dropout-34: Output Size 4096, Params 0
                [4096, 16781312],     // Linear-35: Output Size 4096, Params 16781312
                [4096, 0],            // ReLU-36: Output Size 4096, Params 0
                [4096, 0],            // Dropout-37: Output Size 4096, Params 0
                [1000, 4097000]       // Linear-38: Output Size 1000, Params 4097000
            ]
        },
        
        // Add more test cases here
    ];

    // Run tests
    testCases.forEach((testCase, index) => {
        const parsed = parsePytorchSummary(testCase.summary);
        const expected = testCase.expected;

        console.log(`Test Case ${index + 1}:`);

        // Verify if parsed output matches expected output
        const isPass = parsed.length === expected.length &&
            parsed.every((layer, i) => 
                layer[0] === expected[i][0] && layer[1] === expected[i][1]
            );

        if (!isPass) {
            console.log(`Expected: ${JSON.stringify(expected)}`);
            console.log(`Parsed:   ${JSON.stringify(parsed)}`);
        }

        console.log(`Result: ${isPass ? 'Pass' : 'Fail'}`);
        console.log('---------------------------');
    });
})();

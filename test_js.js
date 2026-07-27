// JavaScript Test File - Smallest Number with Given Digit Count and Sum

function smallestNumberWithDigitSum(s, d) {
    if (s < 1 || s > 9 * d) return "-1";
    const result = new Array(d).fill(0);
    result[0] = 1;
    let remaining = s - 1;
    for (let i = d - 1; i >= 1 && remaining > 0; i--) {
        const add = Math.min(9, remaining);
        result[i] += add;
        remaining -= add;
    }
    result[0] += remaining;
    if (result[0] > 9) return "-1";
    return result.join('');
}

const testCases = [
    { s: 0, d: 1, expected: "-1" },
    { s: 1, d: 1, expected: "1" },
    { s: 9, d: 2, expected: "18" },
    { s: 20, d: 3, expected: "299" },
    { s: 15, d: 3, expected: "159" },
    { s: 5, d: 2, expected: "14" },
    { s: 1, d: 2, expected: "-1" },
    { s: 2, d: 1, expected: "2" },
    { s: 10, d: 2, expected: "19" },
    { s: 27, d: 3, expected: "999" },
    { s: 5, d: 1, expected: "5" },
    { s: 18, d: 2, expected: "99" },
    { s: 2, d: 2, expected: "-1" },
    { s: 3, d: 1, expected: "3" },
    { s: 11, d: 2, expected: "29" },
    { s: 25, d: 3, expected: "889" },
    { s: 12, d: 2, expected: "39" },
    { s: 9, d: 1, expected: "9" },
    { s: 30, d: 4, expected: "3999" },
    { s: 50, d: 5, expected: "59999" },
    { s: 45, d: 5, expected: "99999" },
    { s: 1, d: 10, expected: "1000000000" },
    { s: 9, d: 10, expected: "1000000008" },
    { s: 91, d: 10, expected: "-1" }
];

console.log("🧪 JavaScript Test Suite\n" + "=".repeat(60));
let passed = 0, failed = 0;
testCases.forEach((test, i) => {
    const result = smallestNumberWithDigitSum(test.s, test.d);
    const pass = result === test.expected;
    if (pass) passed++; else failed++;
    console.log(`${pass ? '✅' : '❌'} Test ${i + 1}: s=${test.s}, d=${test.d}`);
    if (!pass) console.log(`   Expected: "${test.expected}" | Got: "${result}"`);
});
console.log("=".repeat(60));
console.log(`\n📊 ${passed}/${testCases.length} PASSED (${(passed/testCases.length*100).toFixed(2)}%)\n`);

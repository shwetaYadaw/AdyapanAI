// Solution for Smallest Number with Given Digit Count and Sum
const fs = require('fs');

function findTheSmallestNumberInAnArray(inputStr) {
  // Write your logic here
  // Process 'inputStr' and return the result
  
  // Parse the input: s (digit sum) and d (digit count)
  const [s, d] = inputStr.trim().split(' ').map(Number);
  
  // Validity check
  // Minimum sum for d digits: 1 (first digit must be >= 1)
  // Maximum sum for d digits: 9*d (all digits are 9)
  if (s < 1 || s > 9 * d) {
    return "-1";
  }
  
  // Initialize result array with all zeros
  const result = new Array(d).fill(0);
  
  // Set first digit to 1 (cannot be 0 for d-digit number)
  result[0] = 1;
  let remaining = s - 1;
  
  // Fill from right to left with maximum possible digits (up to 9)
  for (let i = d - 1; i >= 1 && remaining > 0; i--) {
    const add = Math.min(9, remaining);
    result[i] += add;
    remaining -= add;
  }
  
  // Add any leftover to the first digit
  result[0] += remaining;
  
  // If first digit exceeds 9, it's impossible (shouldn't happen with valid input)
  if (result[0] > 9) {
    return "-1";
  }
  
  // Convert array to string
  return result.join('');
}

function solve() {
  const input = fs.readFileSync(0, 'utf-8').trim();
  if (!input) return;
  console.log(findTheSmallestNumberInAnArray(input));
}

solve();

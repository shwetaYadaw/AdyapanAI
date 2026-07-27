// JavaScript Solution - Find the smallest number in an array
const fs = require('fs');

function findTheSmallestNumberInAnArray(inputStr) {
  // Convert the input string to array of integers
  const arr = inputStr.trim().split(' ').map(Number);
  
  // Find and return the minimum element
  return String(Math.min(...arr));
}

function solve() {
  const input = fs.readFileSync(0, 'utf-8').trim();
  if (!input) return;
  console.log(findTheSmallestNumberInAnArray(input));
}

solve();

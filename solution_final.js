const fs = require('fs');

const input = fs.readFileSync(0, 'utf-8').trim();
const arr = input.split(' ').map(Number);
console.log(Math.min(...arr));

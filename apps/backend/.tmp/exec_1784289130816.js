// Solution for Find Surpasser Count of each element in array
const fs = require('fs');

function findSurpasserCountOfEachElementInArray(inputStr) {
    const arr = inputStr.trim().split(/\s+/).map(Number);
    const n = arr.length;

    const ans = new Array(n).fill(0);

    const temp = arr.map((value, index) => ({ value, index }));

    function mergeSort(left, right) {
        if (left >= right) return;

        const mid = Math.floor((left + right) / 2);

        mergeSort(left, mid);
        mergeSort(mid + 1, right);

        const merged = [];

        let i = left;
        let j = mid + 1;
        let greaterCount = 0;

        
        }

        while (i <= mid) {
            ans[temp[i].index] += right - mid;
            merged.push(temp[i++]);
        }

        while (j <= right) {
            merged.push(temp[j++]);
        }

        for (let k = 0; k < merged.length; k++) {
            temp[left + k] = merged[k];
        }
    }

    mergeSort(0, n - 1);

    return ans.join(' ');
}

function solve() {
    const input = fs.readFileSync(0, 'utf8').trim();
    if (!input) return;
    console.log(findSurpasserCountOfEachElementInArray(input));
}

solve();
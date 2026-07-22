const fs = require('fs');

function findSurpasserCountOfEachElementInArray(inputStr) {
    const arr = inputStr.trim().split(/\s+/).map(Number);
    const n = arr.length;

    

        while (i <= mid && j <= right) {
            if (temp[i].value < temp[j].value) {
                greaterCount = right - j + 1;
                ans[temp[i].index] += greaterCount;
                merged.push(temp[i++]);
            } else {
                merged.push(temp[j++]);
            }
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
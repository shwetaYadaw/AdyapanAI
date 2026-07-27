#include <iostream>
#include <climits>
#include <algorithm>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    
    int num, minNum = INT_MAX;
    while (cin >> num) {
        minNum = min(minNum, num);
    }
    cout << minNum << endl;
    return 0;
}

// C++ Solution - Find the smallest number in an array
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    int num;
    int minNum = INT_MAX;
    
    // Read all integers from input until EOF
    while (cin >> num) {
        minNum = min(minNum, num);
    }
    
    // Output the minimum
    cout << minNum << endl;
    
    return 0;
}

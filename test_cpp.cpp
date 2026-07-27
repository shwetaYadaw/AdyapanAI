// C++ Test File - Smallest Number with Given Digit Count and Sum
#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
#include <iomanip>
using namespace std;

string smallestNumberWithDigitSum(int s, int d) {
    if (s < 1 || s > 9 * d) return "-1";
    vector<int> result(d, 0);
    result[0] = 1;
    int remaining = s - 1;
    for (int i = d - 1; i >= 1 && remaining > 0; i--) {
        int add = min(9, remaining);
        result[i] += add;
        remaining -= add;
    }
    result[0] += remaining;
    if (result[0] > 9) return "-1";
    string resultStr = "";
    for (int digit : result) resultStr += to_string(digit);
    return resultStr;
}

struct TestCase {
    int s, d;
    string expected;
};

int main() {
    vector<TestCase> testCases = {
        {0, 1, "-1"},
        {1, 1, "1"},
        {9, 2, "18"},
        {20, 3, "299"},
        {15, 3, "159"},
        {5, 2, "14"},
        {1, 2, "-1"},
        {2, 1, "2"},
        {10, 2, "19"},
        {27, 3, "999"},
        {5, 1, "5"},
        {18, 2, "99"},
        {2, 2, "-1"},
        {3, 1, "3"},
        {11, 2, "29"},
        {25, 3, "889"},
        {12, 2, "39"},
        {9, 1, "9"},
        {30, 4, "3999"},
        {50, 5, "59999"},
        {45, 5, "99999"},
        {1, 10, "1000000000"},
        {9, 10, "1000000008"},
        {91, 10, "-1"}
    };
    
    cout << "🧪 C++ Test Suite\n" << string(60, '=') << endl;
    int passed = 0, failed = 0;
    
    for (int i = 0; i < testCases.size(); i++) {
        TestCase test = testCases[i];
        string result = smallestNumberWithDigitSum(test.s, test.d);
        bool pass = result == test.expected;
        passed += pass;
        failed += !pass;
        cout << (pass ? "✅" : "❌") << " Test " << (i + 1) << ": s=" << test.s << ", d=" << test.d << endl;
        if (!pass) cout << "   Expected: \"" << test.expected << "\" | Got: \"" << result << "\"" << endl;
    }
    
    cout << string(60, '=') << endl;
    cout << "\n📊 " << passed << "/" << testCases.size() << " PASSED (" 
         << fixed << setprecision(2) << (double)passed/testCases.size()*100 << "%)\n" << endl;
    return 0;
}

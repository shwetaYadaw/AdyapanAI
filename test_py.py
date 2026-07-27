#!/usr/bin/env python3
# Python Test File - Smallest Number with Given Digit Count and Sum

def smallest_number_with_digit_sum(s, d):
    if s < 1 or s > 9 * d:
        return "-1"
    result = [0] * d
    result[0] = 1
    remaining = s - 1
    for i in range(d - 1, 0, -1):
        if remaining == 0:
            break
        add = min(9, remaining)
        result[i] += add
        remaining -= add
    result[0] += remaining
    if result[0] > 9:
        return "-1"
    return ''.join(map(str, result))

test_cases = [
    (0, 1, "-1"),
    (1, 1, "1"),
    (9, 2, "18"),
    (20, 3, "299"),
    (15, 3, "159"),
    (5, 2, "14"),
    (1, 2, "-1"),
    (2, 1, "2"),
    (10, 2, "19"),
    (27, 3, "999"),
    (5, 1, "5"),
    (18, 2, "99"),
    (2, 2, "-1"),
    (3, 1, "3"),
    (11, 2, "29"),
    (25, 3, "889"),
    (12, 2, "39"),
    (9, 1, "9"),
    (30, 4, "3999"),
    (50, 5, "59999"),
    (45, 5, "99999"),
    (1, 10, "1000000000"),
    (9, 10, "1000000008"),
    (91, 10, "-1")
]

print("🧪 Python Test Suite\n" + "="*60)
passed = failed = 0
for i, (s, d, expected) in enumerate(test_cases):
    result = smallest_number_with_digit_sum(s, d)
    is_pass = result == expected
    passed += is_pass
    failed += not is_pass
    status = "✅" if is_pass else "❌"
    print(f"{status} Test {i + 1}: s={s}, d={d}")
    if not is_pass:
        print(f"   Expected: \"{expected}\" | Got: \"{result}\"")
print("="*60)
print(f"\n📊 {passed}/{len(test_cases)} PASSED ({passed/len(test_cases)*100:.2f}%)\n")

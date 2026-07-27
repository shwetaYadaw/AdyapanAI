import sys

def findTheSmallestNumberInAnArray(input_str):
    arr = list(map(int, input_str.split()))
    return str(min(arr))

input_str = sys.stdin.read().strip()
print(findTheSmallestNumberInAnArray(input_str))

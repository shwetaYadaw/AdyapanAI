import sys

def findTheSmallestNumberInAnArray(input_str):
    """Find the smallest number in an array"""
    # Convert the input string to list of integers
    arr = list(map(int, input_str.split()))
    
    # Return the smallest element
    return str(min(arr))

def solve():
    lines = sys.stdin.readlines()
    if not lines:
        return
    
    # First line contains the array elements
    res = findTheSmallestNumberInAnArray(lines[0].strip())
    print(res)

if __name__ == "__main__":
    solve()

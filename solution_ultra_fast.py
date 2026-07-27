import sys
sys.stdin = open(0)
arr = list(map(int, sys.stdin.readline().split()))
print(min(arr))

import * as dotenv from 'dotenv';
import { prisma } from '../src/config/prisma';

dotenv.config();

// Additional problems to add to existing topics
const additionalProblems = [
  // Additional SORTING TECHNIQUES problems
  {
    topic: 'Sorting Techniques',
    problems: [
      {
        title: 'Heap Sort',
        slug: 'heap-sort-algorithm',
        difficulty: 'medium',
        statement: 'Implement heap sort algorithm for sorting arrays.',
        inputFormat: 'First line: n, second line: array elements',
        outputFormat: 'Sorted array',
        constraints: '1 <= n <= 10^5',
        companies: 'Google,Amazon,Microsoft',
        xpReward: 70,
        starterCode: `def heapSort(arr):\n    # Implement heap sort\n    pass`,
        solution: `def heapSort(arr):\n    n = len(arr)\n    for i in range(n // 2 - 1, -1, -1):\n        heapify(arr, n, i)\n    for i in range(n - 1, 0, -1):\n        arr[0], arr[i] = arr[i], arr[0]\n        heapify(arr, i, 0)\n    return arr\ndef heapify(arr, n, i):\n    largest = i\n    left, right = 2 * i + 1, 2 * i + 2\n    if left < n and arr[left] > arr[largest]:\n        largest = left\n    if right < n and arr[right] > arr[largest]:\n        largest = right\n    if largest != i:\n        arr[i], arr[largest] = arr[largest], arr[i]\n        heapify(arr, n, largest)`
      },
      {
        title: 'Counting Sort',
        slug: 'counting-sort',
        difficulty: 'easy',
        statement: 'Implement counting sort for integer arrays.',
        inputFormat: 'First line: n, second line: array elements',
        outputFormat: 'Sorted array',
        constraints: '1 <= n <= 10^5, 0 <= arr[i] <= 10^6',
        companies: 'Google,Amazon,Facebook',
        xpReward: 50,
        starterCode: `def countingSort(arr, max_val):\n    # Implement counting sort\n    pass`,
        solution: `def countingSort(arr, max_val):\n    count = [0] * (max_val + 1)\n    for num in arr:\n        count[num] += 1\n    sorted_arr = []\n    for i in range(len(count)):\n        sorted_arr.extend([i] * count[i])\n    return sorted_arr`
      },
      {
        title: 'Radix Sort',
        slug: 'radix-sort',
        difficulty: 'medium',
        statement: 'Implement radix sort algorithm.',
        inputFormat: 'First line: n, second line: array elements',
        outputFormat: 'Sorted array',
        constraints: '1 <= n <= 10^5, non-negative integers',
        companies: 'Google,Microsoft,Amazon',
        xpReward: 70,
        starterCode: `def radixSort(arr):\n    # Implement radix sort\n    pass`,
        solution: `def radixSort(arr):\n    if len(arr) == 0:\n        return arr\n    max_num = max(arr)\n    exp = 1\n    while max_num // exp > 0:\n        arr = countingSortByExp(arr, exp)\n        exp *= 10\n    return arr\ndef countingSortByExp(arr, exp):\n    n = len(arr)\n    result = [0] * n\n    count = [0] * 10\n    for i in range(n):\n        count[(arr[i] // exp) % 10] += 1\n    for i in range(1, 10):\n        count[i] += count[i - 1]\n    for i in range(n - 1, -1, -1):\n        result[count[(arr[i] // exp) % 10] - 1] = arr[i]\n        count[(arr[i] // exp) % 10] -= 1\n    return result`
      },
      {
        title: 'Bubble Sort',
        slug: 'bubble-sort',
        difficulty: 'easy',
        statement: 'Implement bubble sort algorithm.',
        inputFormat: 'First line: n, second line: array elements',
        outputFormat: 'Sorted array',
        constraints: '1 <= n <= 1000',
        companies: 'Google,Amazon,Facebook',
        xpReward: 40,
        starterCode: `def bubbleSort(arr):\n    # Implement bubble sort\n    pass`,
        solution: `def bubbleSort(arr):\n    n = len(arr)\n    for i in range(n):\n        swapped = False\n        for j in range(0, n - i - 1):\n            if arr[j] > arr[j + 1]:\n                arr[j], arr[j + 1] = arr[j + 1], arr[j]\n                swapped = True\n        if not swapped:\n            break\n    return arr`
      },
      {
        title: 'Selection Sort',
        slug: 'selection-sort',
        difficulty: 'easy',
        statement: 'Implement selection sort algorithm.',
        inputFormat: 'First line: n, second line: array elements',
        outputFormat: 'Sorted array',
        constraints: '1 <= n <= 1000',
        companies: 'Google,Amazon,Microsoft',
        xpReward: 40,
        starterCode: `def selectionSort(arr):\n    # Implement selection sort\n    pass`,
        solution: `def selectionSort(arr):\n    n = len(arr)\n    for i in range(n):\n        min_idx = i\n        for j in range(i + 1, n):\n            if arr[j] < arr[min_idx]:\n                min_idx = j\n        arr[i], arr[min_idx] = arr[min_idx], arr[i]\n    return arr`
      },
      {
        title: 'Shell Sort',
        slug: 'shell-sort',
        difficulty: 'medium',
        statement: 'Implement shell sort algorithm.',
        inputFormat: 'First line: n, second line: array elements',
        outputFormat: 'Sorted array',
        constraints: '1 <= n <= 10^5',
        companies: 'Google,Microsoft,Amazon',
        xpReward: 65,
        starterCode: `def shellSort(arr):\n    # Implement shell sort with gap sequence\n    pass`,
        solution: `def shellSort(arr):\n    n = len(arr)\n    gap = n // 2\n    while gap > 0:\n        for i in range(gap, n):\n            temp = arr[i]\n            j = i\n            while j >= gap and arr[j - gap] > temp:\n                arr[j] = arr[j - gap]\n                j -= gap\n            arr[j] = temp\n        gap //= 2\n    return arr`
      }
    ]
  },

  // Additional BIT MANIPULATION problems
  {
    topic: 'Bit Manipulation',
    problems: [
      {
        title: 'Single Number III',
        slug: 'single-number-iii',
        difficulty: 'medium',
        statement: 'Find two numbers that appear once while all others appear twice.',
        inputFormat: 'Array of integers',
        outputFormat: 'Two unique numbers',
        constraints: '2 <= n <= 3*10^4',
        companies: 'Google,Amazon,Facebook',
        xpReward: 70,
        starterCode: `def singleNumberIII(nums):\n    pass`,
        solution: `def singleNumberIII(nums):\n    xor_all = 0\n    for num in nums:\n        xor_all ^= num\n    rightmost_bit = xor_all & -xor_all\n    num1 = num2 = 0\n    for num in nums:\n        if num & rightmost_bit:\n            num1 ^= num\n        else:\n            num2 ^= num\n    return [num1, num2]`
      },
      {
        title: 'Number of 1 Bits',
        slug: 'number-of-1-bits',
        difficulty: 'easy',
        statement: 'Count the number of 1 bits in binary representation.',
        inputFormat: 'Integer n',
        outputFormat: 'Count of 1 bits',
        constraints: '0 <= n <= 2^31 - 1',
        companies: 'Google,Microsoft,Amazon',
        xpReward: 45,
        starterCode: `def hammingWeight(n):\n    pass`,
        solution: `def hammingWeight(n):\n    count = 0\n    while n:\n        count += n & 1\n        n >>= 1\n    return count`
      },
      {
        title: 'Power of Two',
        slug: 'power-of-two',
        difficulty: 'easy',
        statement: 'Determine if n is a power of two.',
        inputFormat: 'Integer n',
        outputFormat: 'true/false',
        constraints: '-2^31 <= n <= 2^31 - 1',
        companies: 'Google,Amazon,Facebook',
        xpReward: 40,
        starterCode: `def isPowerOfTwo(n):\n    pass`,
        solution: `def isPowerOfTwo(n):\n    return n > 0 and (n & (n - 1)) == 0`
      }
    ]
  },

  // Additional SLIDING WINDOW problems
  {
    topic: 'Sliding Window',
    problems: [
      {
        title: 'Minimum Window Substring',
        slug: 'minimum-window-substring',
        difficulty: 'hard',
        statement: 'Find minimum window that contains all characters.',
        inputFormat: 'Two strings s and t',
        outputFormat: 'Minimum window substring',
        constraints: '1 <= s.length, t.length <= 10^5',
        companies: 'Google,Amazon,Microsoft',
        xpReward: 100,
        starterCode: `def minWindow(s, t):\n    pass`,
        solution: `def minWindow(s, t):\n    if not t or not s:\n        return \"\"\n    required = {c: t.count(c) for c in t}\n    window = {}\n    formed = 0\n    min_len = float('inf')\n    min_start = 0\n    left = 0\n    for right in range(len(s)):\n        window[s[right]] = window.get(s[right], 0) + 1\n        if s[right] in required and window[s[right]] == required[s[right]]:\n            formed += 1\n        while left <= right and formed == len(required):\n            if right - left + 1 < min_len:\n                min_len = right - left + 1\n                min_start = left\n            window[s[left]] -= 1\n            if s[left] in required and window[s[left]] < required[s[left]]:\n                formed -= 1\n            left += 1\n    return s[min_start:min_start + min_len] if min_len != float('inf') else \"\"`
      },
      {
        title: 'Permutation in String',
        slug: 'permutation-in-string',
        difficulty: 'medium',
        statement: 'Check if s2 contains permutation of s1.',
        inputFormat: 'Two strings s1 and s2',
        outputFormat: 'true/false',
        constraints: '1 <= s1.length <= s2.length <= 10^4',
        companies: 'Google,Amazon,Facebook',
        xpReward: 65,
        starterCode: `def checkInclusion(s1, s2):\n    pass`,
        solution: `def checkInclusion(s1, s2):\n    if len(s1) > len(s2):\n        return False\n    s1_count = {}\n    for c in s1:\n        s1_count[c] = s1_count.get(c, 0) + 1\n    window = {}\n    for i in range(len(s2)):\n        window[s2[i]] = window.get(s2[i], 0) + 1\n        if i >= len(s1):\n            if window[s2[i - len(s1)]] == 1:\n                del window[s2[i - len(s1)]]\n            else:\n                window[s2[i - len(s1)]] -= 1\n        if window == s1_count:\n            return True\n    return False`
      },
      {
        title: 'Substring of Concatenated Words',
        slug: 'substring-concatenated-words',
        difficulty: 'hard',
        statement: 'Find all indices where concatenation of words start.',
        inputFormat: 'String s and word list',
        outputFormat: 'List of starting indices',
        constraints: '1 <= s.length <= 10^4',
        companies: 'Google,Amazon,Microsoft',
        xpReward: 100,
        starterCode: `def findSubstring(s, words):\n    pass`,
        solution: `def findSubstring(s, words):\n    if not s or not words:\n        return []\n    word_len = len(words[0])\n    total_len = len(words) * word_len\n    word_count = {}\n    for word in words:\n        word_count[word] = word_count.get(word, 0) + 1\n    result = []\n    for i in range(len(s) - total_len + 1):\n        seen = {}\n        for j in range(len(words)):\n            word = s[i + j * word_len:i + (j + 1) * word_len]\n            if word not in word_count:\n                break\n            seen[word] = seen.get(word, 0) + 1\n            if seen[word] > word_count[word]:\n                break\n        else:\n            result.append(i)\n    return result`
      }
    ]
  }
];

export async function addMoreProblems() {
  try {
    console.log('🌱 Adding more problems to existing topics...\n');
    
    let totalCreated = 0;
    let totalSkipped = 0;
    
    for (const topicData of additionalProblems) {
      const topicName = topicData.topic;
      console.log(`📚 Adding to topic: ${topicName}`);
      
      for (const problem of topicData.problems) {
        try {
          // Check if problem already exists
          const existing = await prisma.problem.findUnique({
            where: { slug: problem.slug }
          });
          
          if (existing) {
            console.log(`   ⏭️  ${problem.title} (already exists)`);
            totalSkipped++;
            continue;
          }

          // Create problem
          const created = await prisma.problem.create({
            data: {
              title: problem.title,
              slug: problem.slug,
              difficulty: problem.difficulty,
              statement: problem.statement,
              inputFormat: problem.inputFormat,
              outputFormat: problem.outputFormat,
              constraints: problem.constraints,
              companies: problem.companies,
              topics: topicName,
              starterCode: { python: problem.starterCode },
              referenceSolution: problem.solution,
              category: 'coding-arena',
              xpReward: problem.xpReward,
              timeLimit: 2000,
              memoryLimit: 256,
              tags: problem.difficulty,
              metadata: {
                languages: ['python', 'javascript', 'java', 'cpp'],
                topics: [topicName],
                difficulty: problem.difficulty
              }
            }
          });

          console.log(`   ✅ ${problem.title} (+${problem.xpReward} XP)`);
          totalCreated++;
          
        } catch (err: any) {
          console.error(`   ❌ ${problem.title}: ${err.message}`);
        }
      }
      console.log('');
    }

    console.log('=====================================');
    console.log('✅ Adding Summary');
    console.log('=====================================');
    console.log(`✨ New problems added: ${totalCreated}`);
    console.log(`⏭️  Already existed: ${totalSkipped}`);
    console.log(`📊 Topics updated: ${additionalProblems.length}`);
    console.log('=====================================\n');
    
  } catch (err) {
    console.error('❌ Error:', err);
    throw err;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed
addMoreProblems().then(() => {
  console.log('🎉 Adding problems finished successfully!');
  process.exit(0);
}).catch((err) => {
  console.error('🔴 Adding problems failed:', err);
  process.exit(1);
});

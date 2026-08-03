import { prisma } from '../config/prisma';
import { logger } from '../utils/logger';

const problem = {
  title: 'Find the Smallest Number in an Array',
  slug: 'find-smallest-number-in-array',
  difficulty: 'easy',
  statement: `## Problem Statement

Given an array of integers, find and return the **smallest (minimum) number** in the array.

---

## Constraints

- \`1 ≤ n ≤ 10^5\`
- \`-10^9 ≤ arr[i] ≤ 10^9\`
- Array will contain at least one element

---

## Examples

### Example 1
**Input:** \`1 2 3\`
**Output:** \`1\`
**Explanation:** The smallest number in the array is 1.

### Example 2
**Input:** \`5 3 8 1 9\`
**Output:** \`1\`
**Explanation:** The smallest number in the array is 1.

### Example 3
**Input:** \`10 20 5 15 25\`
**Output:** \`5\`
**Explanation:** The smallest number in the array is 5.

### Example 4
**Input:** \`-5 -10 3 0 5\`
**Output:** \`-10\`
**Explanation:** The smallest number is -10 (negative numbers are smaller).

### Example 5
**Input:** \`7 7 7 7\`
**Output:** \`7\`
**Explanation:** All elements are the same, so the smallest is 7.`,
  constraints: `1 ≤ n ≤ 10^5
-10^9 ≤ arr[i] ≤ 10^9
Array will contain at least one element`,
  inputFormat: `A single line containing space-separated integers representing the array elements.`,
  outputFormat: `Return the smallest number in the array as an integer.`,
  timeLimit: 2000,
  memoryLimit: 256,
  sampleInput: `1 2 3`,
  sampleOutput: `1`,
  topics: ['Array', 'Basics'],
  companies: ['TCS', 'Accenture', 'Cognizant'],
  templates: {
    python: `def findSmallestNumber(inputStr):
    """
    Find the smallest number in an array.
    
    Args:
        inputStr: String of space-separated integers
    
    Returns:
        String representation of the smallest number
    """
    # Parse input
    arr = list(map(int, inputStr.strip().split()))
    # Find and return smallest
    return str(min(arr))`,
    javascript: `function findSmallestNumber(inputStr) {
    /**
     * Find the smallest number in an array.
     * 
     * @param {string} inputStr - String of space-separated integers
     * @returns {string} The smallest number as a string
     */
    const arr = inputStr.trim().split(/\\s+/).map(Number);
    return Math.min(...arr).toString();
}`,
    cpp: `#include <iostream>
#include <string>
#include <algorithm>
#include <sstream>
using namespace std;

string findSmallestNumber(string inputStr) {
    stringstream ss(inputStr);
    int num, smallest = INT_MAX;
    while (ss >> num) {
        smallest = min(smallest, num);
    }
    return to_string(smallest);
}`,
    java: `import java.util.*;

public class Solution {
    public static String findSmallestNumber(String inputStr) {
        String[] parts = inputStr.trim().split("\\\\s+");
        int smallest = Integer.MAX_VALUE;
        for (String part : parts) {
            smallest = Math.min(smallest, Integer.parseInt(part));
        }
        return String.valueOf(smallest);
    }
}`,
    typescript: `function findSmallestNumber(inputStr: string): string {
    const arr: number[] = inputStr.trim().split(/\\s+/).map(Number);
    return Math.min(...arr).toString();
}`,
    go: `package main

import (
    "fmt"
    "strings"
    "strconv"
    "math"
)

func findSmallestNumber(inputStr string) string {
    parts := strings.Fields(inputStr)
    smallest := math.MaxInt64
    for _, part := range parts {
        num, _ := strconv.Atoi(part)
        if num < smallest {
            smallest = num
        }
    }
    return strconv.Itoa(smallest)
}`,
    csharp: `using System;
using System.Linq;

public class Solution {
    public static string FindSmallestNumber(string inputStr) {
        int[] arr = inputStr.Trim().Split(new[] { ' ', '\\t' }, System.StringSplitOptions.RemoveEmptyEntries)
            .Select(int.Parse).ToArray();
        return arr.Min().ToString();
    }
}`
  },
  testCases: [
    { input: '1 2 3', output: '1' },
    { input: '5 3 8 1 9', output: '1' },
    { input: '10 20 5 15 25', output: '5' },
    { input: '-5 -10 3 0 5', output: '-10' },
    { input: '7 7 7 7', output: '7' },
    { input: '3 2 1', output: '1' },
    { input: '10 10 10 20 30 20', output: '10' },
    { input: '5 3', output: '3' },
    { input: '100', output: '100' },
    { input: '99 98 97 96 95', output: '95' }
  ],
  xpReward: 15,
};

async function addQuestion() {
  try {
    logger.info('Adding question to Question table...');

    // Check if already exists
    const existing = await prisma.question.findUnique({
      where: { slug: problem.slug },
    });

    if (existing) {
      logger.info('Question already exists. Updating...');
      const updated = await prisma.question.update({
        where: { slug: problem.slug },
        data: {
          title: problem.title,
          difficulty: problem.difficulty,
          statement: problem.statement,
          constraints: problem.constraints,
          inputFormat: problem.inputFormat,
          outputFormat: problem.outputFormat,
          timeLimit: problem.timeLimit,
          memoryLimit: problem.memoryLimit,
          sampleInput: problem.sampleInput,
          sampleOutput: problem.sampleOutput,
          templates: problem.templates,
          topics: problem.topics,
          companies: problem.companies,
          xpReward: problem.xpReward,
          testCases: problem.testCases,
        },
      });

      logger.info(`✅ Question updated successfully! Question ID: ${updated.id}`);
      return updated;
    }

    // Create new question
    const created = await prisma.question.create({
      data: {
        title: problem.title,
        slug: problem.slug,
        difficulty: problem.difficulty,
        statement: problem.statement,
        constraints: problem.constraints,
        inputFormat: problem.inputFormat,
        outputFormat: problem.outputFormat,
        timeLimit: problem.timeLimit,
        memoryLimit: problem.memoryLimit,
        sampleInput: problem.sampleInput,
        sampleOutput: problem.sampleOutput,
        templates: problem.templates,
        topics: problem.topics,
        companies: problem.companies,
        xpReward: problem.xpReward,
        testCases: problem.testCases,
      },
    });

    logger.info(`✅ Question created successfully! Question ID: ${created.id}`);
    return created;
  } catch (error) {
    logger.error('❌ Error adding question:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

addQuestion();

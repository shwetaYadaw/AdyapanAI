import * as dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env') });
import { prisma } from '../src/config/prisma';

function slugify(text: string): string {
  return text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
}

interface Q {
  title: string;
  difficulty: string;
  statement: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  referenceSolution: string;
  testCases: { input: string; output: string; isHidden?: boolean; explanation?: string }[];
  experienceLevel: 'freshers' | 'experienced';
}

// ═══════════════════════════════════════════════════════════════════════════════
// LINKED LIST
// ═══════════════════════════════════════════════════════════════════════════════
const LINKED_LIST: Q[] = [
  // ─── FRESHERS ───
  { title: 'Print Linked List Elements', difficulty: 'easy', experienceLevel: 'freshers',
    statement: 'Given a linked list represented as space-separated integers, print each element on a new line.',
    inputFormat: 'A single line with space-separated integers representing linked list nodes.',
    outputFormat: 'Print each element on a new line.',
    constraints: '1 <= N <= 1000',
    referenceSolution: `function solve(input) { input.trim().split(/\\s+/).forEach(x => console.log(x)); }`,
    testCases: [{ input: '1 2 3 4 5', output: '1\n2\n3\n4\n5', isHidden: false }, { input: '10', output: '10', isHidden: true }] },
  { title: 'Find Length of Linked List', difficulty: 'easy', experienceLevel: 'freshers',
    statement: 'Given a linked list as space-separated integers, find its length.',
    inputFormat: 'A single line with space-separated integers.',
    outputFormat: 'Print the count of elements.',
    constraints: '0 <= N <= 10^5',
    referenceSolution: `function solve(input) { const arr = input.trim().split(/\\s+/).filter(Boolean); console.log(arr.length); }`,
    testCases: [{ input: '1 2 3 4', output: '4', isHidden: false }, { input: '5', output: '1', isHidden: true }] },
  { title: 'Reverse a Linked List', difficulty: 'easy', experienceLevel: 'freshers',
    statement: 'Given a linked list as space-separated integers, reverse it and print the result.',
    inputFormat: 'A single line with space-separated integers.',
    outputFormat: 'Print the reversed list space-separated.',
    constraints: '1 <= N <= 10^5',
    referenceSolution: `function solve(input) { console.log(input.trim().split(/\\s+/).reverse().join(' ')); }`,
    testCases: [{ input: '1 2 3 4 5', output: '5 4 3 2 1', isHidden: false }, { input: '10 20', output: '20 10', isHidden: true }] },
  { title: 'Find Middle Element of Linked List', difficulty: 'easy', experienceLevel: 'freshers',
    statement: 'Given a linked list, find the middle element. If even length, return the second middle.',
    inputFormat: 'A single line with space-separated integers.',
    outputFormat: 'Print the middle element.',
    constraints: '1 <= N <= 10^5',
    referenceSolution: `function solve(input) { const arr = input.trim().split(/\\s+/); console.log(arr[Math.floor(arr.length/2)]); }`,
    testCases: [{ input: '1 2 3 4 5', output: '3', isHidden: false }, { input: '1 2 3 4', output: '3', isHidden: true }] },
  { title: 'Detect Duplicate in Linked List', difficulty: 'easy', experienceLevel: 'freshers',
    statement: 'Given a linked list as integers, check if any element appears more than once. Print "YES" or "NO".',
    inputFormat: 'A single line with space-separated integers.',
    outputFormat: 'Print "YES" if duplicate exists, else "NO".',
    constraints: '1 <= N <= 10^5',
    referenceSolution: `function solve(input) { const arr = input.trim().split(/\\s+/); console.log(new Set(arr).size < arr.length ? 'YES' : 'NO'); }`,
    testCases: [{ input: '1 2 3 2 5', output: 'YES', isHidden: false }, { input: '1 2 3 4', output: 'NO', isHidden: true }] },
  { title: 'Remove Duplicates from Sorted Linked List', difficulty: 'easy', experienceLevel: 'freshers',
    statement: 'Given a sorted linked list, remove all duplicate elements so each element appears only once.',
    inputFormat: 'A single line with space-separated sorted integers.',
    outputFormat: 'Print the list after removing duplicates, space-separated.',
    constraints: '1 <= N <= 10^5',
    referenceSolution: `function solve(input) { const arr = input.trim().split(/\\s+/); console.log([...new Set(arr)].join(' ')); }`,
    testCases: [{ input: '1 1 2 3 3', output: '1 2 3', isHidden: false }, { input: '1 1 1', output: '1', isHidden: true }] },
  { title: 'Merge Two Sorted Linked Lists', difficulty: 'easy', experienceLevel: 'freshers',
    statement: 'Given two sorted linked lists, merge them into one sorted list.',
    inputFormat: 'First line: first sorted list (space-separated).\nSecond line: second sorted list.',
    outputFormat: 'Print merged sorted list space-separated.',
    constraints: '0 <= N, M <= 10^4',
    referenceSolution: `function solve(input) { const lines = input.trim().split('\\n'); const a = lines[0].trim().split(/\\s+/).map(Number); const b = lines[1].trim().split(/\\s+/).map(Number); console.log([...a,...b].sort((x,y)=>x-y).join(' ')); }`,
    testCases: [{ input: '1 3 5\n2 4 6', output: '1 2 3 4 5 6', isHidden: false }, { input: '1 2\n3 4 5', output: '1 2 3 4 5', isHidden: true }] },
  { title: 'Delete Nth Node from End', difficulty: 'easy', experienceLevel: 'freshers',
    statement: 'Given a linked list and N, remove the Nth node from the end and print the list.',
    inputFormat: 'First line: space-separated integers.\nSecond line: integer N.',
    outputFormat: 'Print the modified list space-separated.',
    constraints: '1 <= size <= 10^4\n1 <= N <= size',
    referenceSolution: `function solve(input) { const lines = input.trim().split('\\n'); const arr = lines[0].trim().split(/\\s+/); const n = parseInt(lines[1]); arr.splice(arr.length - n, 1); console.log(arr.join(' ')); }`,
    testCases: [{ input: '1 2 3 4 5\n2', output: '1 2 3 5', isHidden: false }, { input: '1\n1', output: '', isHidden: true }] },
  // ─── EXPERIENCED ───
  { title: 'Detect Cycle in Linked List (Floyd)', difficulty: 'medium', experienceLevel: 'experienced',
    statement: 'Given an array representing next pointers of a linked list (0-indexed, -1 means null), detect if a cycle exists. Print "YES" or "NO".',
    inputFormat: 'First line: N (number of nodes).\nSecond line: N integers representing next pointers (-1 for null).',
    outputFormat: 'Print "YES" if cycle exists, else "NO".',
    constraints: '1 <= N <= 10^5',
    referenceSolution: `function solve(input) { const lines = input.trim().split('\\n'); const n = parseInt(lines[0]); const next = lines[1].trim().split(/\\s+/).map(Number); const visited = new Set(); let cur = 0; while (cur !== -1 && !visited.has(cur)) { visited.add(cur); cur = next[cur]; } console.log(cur !== -1 ? 'YES' : 'NO'); }`,
    testCases: [{ input: '4\n1 2 3 1', output: 'YES', isHidden: false }, { input: '3\n1 2 -1', output: 'NO', isHidden: true }] },
  { title: 'LRU Cache Implementation', difficulty: 'hard', experienceLevel: 'experienced',
    statement: 'Implement an LRU Cache. Given capacity and operations (get/put), output results of get operations. get returns -1 if key not found.',
    inputFormat: 'First line: capacity.\nSecond line: number of operations Q.\nNext Q lines: "get key" or "put key value".',
    outputFormat: 'For each get operation, print the value or -1.',
    constraints: '1 <= capacity <= 1000\n1 <= Q <= 10^4',
    referenceSolution: `function solve(input) { const lines = input.trim().split('\\n'); const cap = parseInt(lines[0]); const q = parseInt(lines[1]); const map = new Map(); const res = []; for (let i = 2; i < 2 + q; i++) { const parts = lines[i].trim().split(/\\s+/); if (parts[0] === 'get') { const k = parts[1]; if (map.has(k)) { const v = map.get(k); map.delete(k); map.set(k, v); res.push(v); } else res.push(-1); } else { const k = parts[1], v = parseInt(parts[2]); if (map.has(k)) map.delete(k); map.set(k, v); if (map.size > cap) map.delete(map.keys().next().value); } } res.forEach(r => console.log(r)); }`,
    testCases: [{ input: '2\n5\nput 1 1\nput 2 2\nget 1\nput 3 3\nget 2', output: '1\n-1', isHidden: false }, { input: '1\n3\nput 1 10\nput 2 20\nget 1', output: '-1', isHidden: true }] },
  { title: 'Reverse Nodes in K-Group', difficulty: 'hard', experienceLevel: 'experienced',
    statement: 'Given a linked list, reverse nodes in groups of K. If remaining nodes < K, leave them as-is.',
    inputFormat: 'First line: space-separated integers.\nSecond line: integer K.',
    outputFormat: 'Print the modified list space-separated.',
    constraints: '1 <= N <= 5000\n1 <= K <= N',
    referenceSolution: `function solve(input) { const lines = input.trim().split('\\n'); const arr = lines[0].trim().split(/\\s+/); const k = parseInt(lines[1]); const result = []; for (let i = 0; i < arr.length; i += k) { const chunk = arr.slice(i, i + k); if (chunk.length === k) result.push(...chunk.reverse()); else result.push(...chunk); } console.log(result.join(' ')); }`,
    testCases: [{ input: '1 2 3 4 5\n2', output: '2 1 4 3 5', isHidden: false }, { input: '1 2 3 4 5\n3', output: '3 2 1 4 5', isHidden: true }] },
  { title: 'Flatten a Multilevel Linked List', difficulty: 'medium', experienceLevel: 'experienced',
    statement: 'Given multiple sorted linked lists (one per line), merge all into one sorted list.',
    inputFormat: 'First line: K (number of lists).\nNext K lines: space-separated sorted integers.',
    outputFormat: 'Print the merged sorted list space-separated.',
    constraints: '1 <= K <= 100\n1 <= total elements <= 10^5',
    referenceSolution: `function solve(input) { const lines = input.trim().split('\\n'); const k = parseInt(lines[0]); let all = []; for (let i = 1; i <= k; i++) all.push(...lines[i].trim().split(/\\s+/).map(Number)); console.log(all.sort((a,b) => a-b).join(' ')); }`,
    testCases: [{ input: '3\n1 4 7\n2 5 8\n3 6 9', output: '1 2 3 4 5 6 7 8 9', isHidden: false }, { input: '2\n1 3\n2 4', output: '1 2 3 4', isHidden: true }] },
  { title: 'Add Two Numbers as Linked Lists', difficulty: 'medium', experienceLevel: 'experienced',
    statement: 'Two numbers are represented as linked lists in reverse order. Add them and return the sum as a linked list in reverse order.',
    inputFormat: 'First line: first number digits reversed, space-separated.\nSecond line: second number digits reversed.',
    outputFormat: 'Print sum digits reversed, space-separated.',
    constraints: '1 <= digits <= 100',
    referenceSolution: `function solve(input) { const lines = input.trim().split('\\n'); const a = lines[0].trim().split(/\\s+/).map(Number); const b = lines[1].trim().split(/\\s+/).map(Number); const res = []; let carry = 0; for (let i = 0; i < Math.max(a.length, b.length) || carry; i++) { const sum = (a[i]||0) + (b[i]||0) + carry; res.push(sum % 10); carry = Math.floor(sum / 10); } console.log(res.join(' ')); }`,
    testCases: [{ input: '2 4 3\n5 6 4', output: '7 0 8', isHidden: false, explanation: '342 + 465 = 807' }, { input: '9 9 9\n1', output: '0 0 0 1', isHidden: true }] },
  { title: 'Sort a Linked List (Merge Sort)', difficulty: 'medium', experienceLevel: 'experienced',
    statement: 'Given a linked list, sort it in ascending order using O(n log n) time complexity.',
    inputFormat: 'A single line with space-separated integers.',
    outputFormat: 'Print the sorted list space-separated.',
    constraints: '1 <= N <= 10^5',
    referenceSolution: `function solve(input) { console.log(input.trim().split(/\\s+/).map(Number).sort((a,b)=>a-b).join(' ')); }`,
    testCases: [{ input: '4 2 1 3', output: '1 2 3 4', isHidden: false }, { input: '-1 5 3 4 0', output: '-1 0 3 4 5', isHidden: true }] },
  { title: 'Copy List with Random Pointer', difficulty: 'hard', experienceLevel: 'experienced',
    statement: 'Given N nodes where each has a value and a random pointer index (-1 for null), output the random pointer indices in order.',
    inputFormat: 'First line: N.\nSecond line: N values.\nThird line: N random pointer indices (-1 for null).',
    outputFormat: 'Print the random pointer indices space-separated (deep copy verification).',
    constraints: '0 <= N <= 1000',
    referenceSolution: `function solve(input) { const lines = input.trim().split('\\n'); const n = parseInt(lines[0]); if (n === 0) { console.log(''); return; } console.log(lines[2].trim()); }`,
    testCases: [{ input: '3\n7 13 11\n-1 0 2', output: '-1 0 2', isHidden: false }, { input: '1\n1\n-1', output: '-1', isHidden: true }] },
];

// ═══════════════════════════════════════════════════════════════════════════════
// TREES
// ═══════════════════════════════════════════════════════════════════════════════
const TREES: Q[] = [
  // ─── FRESHERS ───
  { title: 'Inorder Traversal of Binary Tree', difficulty: 'easy', experienceLevel: 'freshers',
    statement: 'Given a binary tree as level-order input (use -1 for null), print its inorder traversal.',
    inputFormat: 'Space-separated integers representing level-order traversal (-1 = null).',
    outputFormat: 'Print inorder traversal space-separated.',
    constraints: '1 <= nodes <= 1000',
    referenceSolution: `function solve(input) { const arr = input.trim().split(/\\s+/).map(Number); const res = []; function inorder(i) { if (i >= arr.length || arr[i] === -1) return; inorder(2*i+1); res.push(arr[i]); inorder(2*i+2); } inorder(0); console.log(res.join(' ')); }`,
    testCases: [{ input: '1 2 3 4 5 -1 -1', output: '4 2 5 1 3', isHidden: false }, { input: '1 -1 2', output: '1 2', isHidden: true }] },
  { title: 'Preorder Traversal of Binary Tree', difficulty: 'easy', experienceLevel: 'freshers',
    statement: 'Given a binary tree as level-order input (-1 for null), print its preorder traversal.',
    inputFormat: 'Space-separated integers (-1 = null).',
    outputFormat: 'Print preorder traversal space-separated.',
    constraints: '1 <= nodes <= 1000',
    referenceSolution: `function solve(input) { const arr = input.trim().split(/\\s+/).map(Number); const res = []; function pre(i) { if (i >= arr.length || arr[i] === -1) return; res.push(arr[i]); pre(2*i+1); pre(2*i+2); } pre(0); console.log(res.join(' ')); }`,
    testCases: [{ input: '1 2 3 4 5 -1 -1', output: '1 2 4 5 3', isHidden: false }, { input: '5 3 8', output: '5 3 8', isHidden: true }] },
  { title: 'Height of Binary Tree', difficulty: 'easy', experienceLevel: 'freshers',
    statement: 'Given a binary tree as level-order input (-1 for null), find its height (number of edges on longest path from root to leaf).',
    inputFormat: 'Space-separated integers (-1 = null).',
    outputFormat: 'Print the height.',
    constraints: '1 <= nodes <= 10^4',
    referenceSolution: `function solve(input) { const arr = input.trim().split(/\\s+/).map(Number); function height(i) { if (i >= arr.length || arr[i] === -1) return -1; return 1 + Math.max(height(2*i+1), height(2*i+2)); } console.log(height(0)); }`,
    testCases: [{ input: '1 2 3 4 5 -1 -1', output: '2', isHidden: false }, { input: '1', output: '0', isHidden: true }] },
  { title: 'Count Nodes in Binary Tree', difficulty: 'easy', experienceLevel: 'freshers',
    statement: 'Given a binary tree as level-order (-1 = null), count total number of valid nodes.',
    inputFormat: 'Space-separated integers (-1 = null).',
    outputFormat: 'Print the count of nodes.',
    constraints: '0 <= nodes <= 10^4',
    referenceSolution: `function solve(input) { const arr = input.trim().split(/\\s+/).map(Number); console.log(arr.filter(x => x !== -1).length); }`,
    testCases: [{ input: '1 2 3 -1 -1 4 5', output: '5', isHidden: false }, { input: '1', output: '1', isHidden: true }] },
  { title: 'Level Order Traversal', difficulty: 'easy', experienceLevel: 'freshers',
    statement: 'Given a binary tree as level-order input (-1 = null), print level order traversal (only valid nodes, level by level on same line).',
    inputFormat: 'Space-separated integers (-1 = null).',
    outputFormat: 'Print valid nodes space-separated in level order.',
    constraints: '1 <= nodes <= 10^4',
    referenceSolution: `function solve(input) { const arr = input.trim().split(/\\s+/).map(Number); console.log(arr.filter(x => x !== -1).join(' ')); }`,
    testCases: [{ input: '3 9 20 -1 -1 15 7', output: '3 9 20 15 7', isHidden: false }, { input: '1 2 3', output: '1 2 3', isHidden: true }] },
  { title: 'Check if Binary Tree is Symmetric', difficulty: 'easy', experienceLevel: 'freshers',
    statement: 'Given a binary tree as level-order (-1 = null), check if it is symmetric (mirror of itself). Print "YES" or "NO".',
    inputFormat: 'Space-separated integers (-1 = null).',
    outputFormat: 'Print "YES" or "NO".',
    constraints: '1 <= nodes <= 1000',
    referenceSolution: `function solve(input) { const arr = input.trim().split(/\\s+/).map(Number); function isMirror(i, j) { if (i >= arr.length && j >= arr.length) return true; if (i >= arr.length || j >= arr.length) return arr[i] === -1 && arr[j] === -1; if (arr[i] !== arr[j]) return false; if (arr[i] === -1) return true; return isMirror(2*i+1, 2*j+2) && isMirror(2*i+2, 2*j+1); } console.log(isMirror(2*0+1, 2*0+2) ? 'YES' : 'NO'); }`,
    testCases: [{ input: '1 2 2 3 4 4 3', output: 'YES', isHidden: false }, { input: '1 2 2 -1 3 -1 3', output: 'NO', isHidden: true }] },
  { title: 'Sum of All Nodes in Binary Tree', difficulty: 'easy', experienceLevel: 'freshers',
    statement: 'Given a binary tree as level-order (-1 = null), find the sum of all valid node values.',
    inputFormat: 'Space-separated integers (-1 = null).',
    outputFormat: 'Print the sum.',
    constraints: '1 <= nodes <= 10^4',
    referenceSolution: `function solve(input) { const arr = input.trim().split(/\\s+/).map(Number); console.log(arr.filter(x => x !== -1).reduce((a,b) => a+b, 0)); }`,
    testCases: [{ input: '1 2 3 4 5', output: '15', isHidden: false }, { input: '10 -1 20', output: '30', isHidden: true }] },
  { title: 'Find Maximum Value in Binary Tree', difficulty: 'easy', experienceLevel: 'freshers',
    statement: 'Given a binary tree as level-order (-1 = null), find the maximum node value.',
    inputFormat: 'Space-separated integers (-1 = null).',
    outputFormat: 'Print the maximum value.',
    constraints: '1 <= nodes <= 10^4',
    referenceSolution: `function solve(input) { const arr = input.trim().split(/\\s+/).map(Number); console.log(Math.max(...arr.filter(x => x !== -1))); }`,
    testCases: [{ input: '1 5 3 8 2', output: '8', isHidden: false }, { input: '100', output: '100', isHidden: true }] },
  // ─── EXPERIENCED ───
  { title: 'Lowest Common Ancestor', difficulty: 'medium', experienceLevel: 'experienced',
    statement: 'Given a BST as sorted array and two values P and Q, find their Lowest Common Ancestor value.',
    inputFormat: 'First line: sorted array (BST inorder).\nSecond line: P Q.',
    outputFormat: 'Print the LCA value.',
    constraints: '2 <= N <= 10^5',
    referenceSolution: `function solve(input) { const lines = input.trim().split('\\n'); const arr = lines[0].trim().split(/\\s+/).map(Number); const [p,q] = lines[1].trim().split(/\\s+/).map(Number); const lo = Math.min(p,q), hi = Math.max(p,q); for (const v of arr) { if (v >= lo && v <= hi) { console.log(v); return; } } }`,
    testCases: [{ input: '2 3 4 5 6 7 8\n2 8', output: '5', isHidden: false }, { input: '1 2 3 4 5\n2 4', output: '3', isHidden: true }] },
  { title: 'Validate Binary Search Tree', difficulty: 'medium', experienceLevel: 'experienced',
    statement: 'Given a binary tree as level-order (-1 = null), check if it is a valid BST. Print "YES" or "NO".',
    inputFormat: 'Space-separated integers (-1 = null).',
    outputFormat: 'Print "YES" or "NO".',
    constraints: '1 <= nodes <= 10^4',
    referenceSolution: `function solve(input) { const arr = input.trim().split(/\\s+/).map(Number); function valid(i, min, max) { if (i >= arr.length || arr[i] === -1) return true; if (arr[i] <= min || arr[i] >= max) return false; return valid(2*i+1, min, arr[i]) && valid(2*i+2, arr[i], max); } console.log(valid(0, -Infinity, Infinity) ? 'YES' : 'NO'); }`,
    testCases: [{ input: '2 1 3', output: 'YES', isHidden: false }, { input: '5 1 4 -1 -1 3 6', output: 'NO', isHidden: true }] },
  { title: 'Diameter of Binary Tree', difficulty: 'medium', experienceLevel: 'experienced',
    statement: 'Given a binary tree as level-order (-1 = null), find the diameter (longest path between any two nodes in terms of edges).',
    inputFormat: 'Space-separated integers (-1 = null).',
    outputFormat: 'Print the diameter.',
    constraints: '1 <= nodes <= 10^4',
    referenceSolution: `function solve(input) { const arr = input.trim().split(/\\s+/).map(Number); let dia = 0; function height(i) { if (i >= arr.length || arr[i] === -1) return 0; const l = height(2*i+1), r = height(2*i+2); dia = Math.max(dia, l+r); return 1 + Math.max(l, r); } height(0); console.log(dia); }`,
    testCases: [{ input: '1 2 3 4 5', output: '3', isHidden: false }, { input: '1 2 -1 3 -1 4 -1', output: '3', isHidden: true }] },
  { title: 'Zigzag Level Order Traversal', difficulty: 'medium', experienceLevel: 'experienced',
    statement: 'Given a binary tree as level-order (-1 = null), return zigzag level order traversal (alternating left-right per level). Print each level on a new line.',
    inputFormat: 'Space-separated integers (-1 = null).',
    outputFormat: 'Each level on a new line, space-separated. Odd levels (0-indexed) reversed.',
    constraints: '1 <= nodes <= 2000',
    referenceSolution: `function solve(input) { const arr = input.trim().split(/\\s+/).map(Number); const levels = []; let start = 0, size = 1; while (start < arr.length) { const level = arr.slice(start, start+size).filter(x => x !== -1); levels.push(level); start += size; size *= 2; } levels.forEach((lvl, i) => { if (i % 2 === 1) lvl.reverse(); if (lvl.length > 0) console.log(lvl.join(' ')); }); }`,
    testCases: [{ input: '3 9 20 -1 -1 15 7', output: '3\n20 9\n15 7', isHidden: false }, { input: '1 2 3 4 5 6 7', output: '1\n3 2\n4 5 6 7', isHidden: true }] },
  { title: 'Serialize and Deserialize Binary Tree', difficulty: 'hard', experienceLevel: 'experienced',
    statement: 'Given a binary tree as level-order (-1 = null), serialize it to a string and print. The serialized format is the same level-order representation.',
    inputFormat: 'Space-separated integers (-1 = null).',
    outputFormat: 'Print the serialized string (same format, trimming trailing -1s).',
    constraints: '0 <= nodes <= 10^4',
    referenceSolution: `function solve(input) { const arr = input.trim().split(/\\s+/).map(Number); while (arr.length > 0 && arr[arr.length-1] === -1) arr.pop(); console.log(arr.join(' ')); }`,
    testCases: [{ input: '1 2 3 -1 -1 4 5 -1 -1 -1 -1', output: '1 2 3 -1 -1 4 5', isHidden: false }, { input: '1', output: '1', isHidden: true }] },
  { title: 'Maximum Path Sum in Binary Tree', difficulty: 'hard', experienceLevel: 'experienced',
    statement: 'Given a binary tree as level-order (-1 = null), find the maximum path sum. A path can start and end at any node.',
    inputFormat: 'Space-separated integers (-1 = null). Nodes can be negative.',
    outputFormat: 'Print the maximum path sum.',
    constraints: '1 <= nodes <= 3 * 10^4\n-1000 <= Node.val <= 1000',
    referenceSolution: `function solve(input) { const arr = input.trim().split(/\\s+/).map(Number); let maxSum = -Infinity; function dfs(i) { if (i >= arr.length || arr[i] === -1) return 0; const l = Math.max(0, dfs(2*i+1)); const r = Math.max(0, dfs(2*i+2)); maxSum = Math.max(maxSum, arr[i] + l + r); return arr[i] + Math.max(l, r); } dfs(0); console.log(maxSum); }`,
    testCases: [{ input: '-10 9 20 -1 -1 15 7', output: '42', isHidden: false, explanation: '15 + 20 + 7 = 42' }, { input: '1 2 3', output: '6', isHidden: true }] },
  { title: 'Binary Tree Right Side View', difficulty: 'medium', experienceLevel: 'experienced',
    statement: 'Given a binary tree as level-order (-1 = null), print what you would see from the right side (last valid node of each level).',
    inputFormat: 'Space-separated integers (-1 = null).',
    outputFormat: 'Print right side view space-separated.',
    constraints: '1 <= nodes <= 10^4',
    referenceSolution: `function solve(input) { const arr = input.trim().split(/\\s+/).map(Number); const res = []; let start = 0, size = 1; while (start < arr.length) { const level = arr.slice(start, start+size).filter(x => x !== -1); if (level.length > 0) res.push(level[level.length-1]); start += size; size *= 2; } console.log(res.join(' ')); }`,
    testCases: [{ input: '1 2 3 -1 5 -1 4', output: '1 3 4', isHidden: false }, { input: '1 2 3', output: '1 3', isHidden: true }] },
];

// ═══════════════════════════════════════════════════════════════════════════════
// GRAPHS
// ═══════════════════════════════════════════════════════════════════════════════
const GRAPHS: Q[] = [
  // ─── FRESHERS ───
  { title: 'BFS Traversal of Graph', difficulty: 'easy', experienceLevel: 'freshers',
    statement: 'Given an undirected graph with N nodes (0-indexed) and M edges, print BFS traversal starting from node 0.',
    inputFormat: 'First line: N M.\nNext M lines: u v (edge between u and v).',
    outputFormat: 'Print BFS traversal space-separated.',
    constraints: '1 <= N <= 1000\n0 <= M <= N*(N-1)/2',
    referenceSolution: `function solve(input) { const lines = input.trim().split('\\n'); const [n,m] = lines[0].split(/\\s+/).map(Number); const adj = Array.from({length:n}, ()=>[]); for (let i=1;i<=m;i++){const[u,v]=lines[i].split(/\\s+/).map(Number);adj[u].push(v);adj[v].push(u);} const visited=new Set(); const q=[0]; visited.add(0); const res=[]; while(q.length){const node=q.shift();res.push(node);adj[node].sort((a,b)=>a-b).forEach(nb=>{if(!visited.has(nb)){visited.add(nb);q.push(nb);}})} console.log(res.join(' ')); }`,
    testCases: [{ input: '5 4\n0 1\n0 2\n1 3\n2 4', output: '0 1 2 3 4', isHidden: false }, { input: '3 2\n0 1\n1 2', output: '0 1 2', isHidden: true }] },
  { title: 'DFS Traversal of Graph', difficulty: 'easy', experienceLevel: 'freshers',
    statement: 'Given an undirected graph with N nodes (0-indexed) and M edges, print DFS traversal starting from node 0.',
    inputFormat: 'First line: N M.\nNext M lines: u v.',
    outputFormat: 'Print DFS traversal space-separated.',
    constraints: '1 <= N <= 1000\n0 <= M <= N*(N-1)/2',
    referenceSolution: `function solve(input) { const lines = input.trim().split('\\n'); const [n,m] = lines[0].split(/\\s+/).map(Number); const adj = Array.from({length:n}, ()=>[]); for(let i=1;i<=m;i++){const[u,v]=lines[i].split(/\\s+/).map(Number);adj[u].push(v);adj[v].push(u);} adj.forEach(a=>a.sort((x,y)=>x-y)); const visited=new Set(); const res=[]; function dfs(node){visited.add(node);res.push(node);adj[node].forEach(nb=>{if(!visited.has(nb))dfs(nb);})} dfs(0); console.log(res.join(' ')); }`,
    testCases: [{ input: '5 4\n0 1\n0 2\n1 3\n2 4', output: '0 1 3 2 4', isHidden: false }, { input: '3 2\n0 1\n1 2', output: '0 1 2', isHidden: true }] },
  { title: 'Count Connected Components', difficulty: 'easy', experienceLevel: 'freshers',
    statement: 'Given an undirected graph, count the number of connected components.',
    inputFormat: 'First line: N M.\nNext M lines: u v.',
    outputFormat: 'Print the count of connected components.',
    constraints: '1 <= N <= 10^4\n0 <= M <= 10^5',
    referenceSolution: `function solve(input) { const lines = input.trim().split('\\n'); const [n,m] = lines[0].split(/\\s+/).map(Number); const adj = Array.from({length:n}, ()=>[]); for(let i=1;i<=m;i++){const[u,v]=lines[i].split(/\\s+/).map(Number);adj[u].push(v);adj[v].push(u);} const visited=new Set(); let count=0; for(let i=0;i<n;i++){if(!visited.has(i)){count++;const q=[i];visited.add(i);while(q.length){const node=q.shift();adj[node].forEach(nb=>{if(!visited.has(nb)){visited.add(nb);q.push(nb);}});}}} console.log(count); }`,
    testCases: [{ input: '5 3\n0 1\n1 2\n3 4', output: '2', isHidden: false }, { input: '4 0', output: '4', isHidden: true }] },
  { title: 'Detect Cycle in Undirected Graph', difficulty: 'easy', experienceLevel: 'freshers',
    statement: 'Given an undirected graph, detect if it contains a cycle. Print "YES" or "NO".',
    inputFormat: 'First line: N M.\nNext M lines: u v.',
    outputFormat: 'Print "YES" if cycle exists, else "NO".',
    constraints: '1 <= N <= 10^4\n0 <= M <= 10^5',
    referenceSolution: `function solve(input) { const lines = input.trim().split('\\n'); const [n,m] = lines[0].split(/\\s+/).map(Number); const adj = Array.from({length:n},()=>[]); for(let i=1;i<=m;i++){const[u,v]=lines[i].split(/\\s+/).map(Number);adj[u].push(v);adj[v].push(u);} const visited=new Set(); function hasCycle(node,parent){visited.add(node);for(const nb of adj[node]){if(!visited.has(nb)){if(hasCycle(nb,node))return true;}else if(nb!==parent)return true;}return false;} for(let i=0;i<n;i++){if(!visited.has(i)&&hasCycle(i,-1)){console.log('YES');return;}} console.log('NO'); }`,
    testCases: [{ input: '4 4\n0 1\n1 2\n2 3\n3 0', output: 'YES', isHidden: false }, { input: '3 2\n0 1\n1 2', output: 'NO', isHidden: true }] },
  { title: 'Check if Graph is Bipartite', difficulty: 'medium', experienceLevel: 'freshers',
    statement: 'Given an undirected graph, check if it is bipartite (2-colorable). Print "YES" or "NO".',
    inputFormat: 'First line: N M.\nNext M lines: u v.',
    outputFormat: 'Print "YES" or "NO".',
    constraints: '1 <= N <= 10^4',
    referenceSolution: `function solve(input) { const lines = input.trim().split('\\n'); const [n,m] = lines[0].split(/\\s+/).map(Number); const adj = Array.from({length:n},()=>[]); for(let i=1;i<=m;i++){const[u,v]=lines[i].split(/\\s+/).map(Number);adj[u].push(v);adj[v].push(u);} const color=Array(n).fill(-1); function bfs(start){color[start]=0;const q=[start];while(q.length){const node=q.shift();for(const nb of adj[node]){if(color[nb]===-1){color[nb]=1-color[node];q.push(nb);}else if(color[nb]===color[node])return false;}}return true;} for(let i=0;i<n;i++){if(color[i]===-1&&!bfs(i)){console.log('NO');return;}} console.log('YES'); }`,
    testCases: [{ input: '4 4\n0 1\n1 2\n2 3\n3 0', output: 'YES', isHidden: false }, { input: '3 3\n0 1\n1 2\n0 2', output: 'NO', isHidden: true }] },
  { title: 'Find Shortest Path (Unweighted)', difficulty: 'easy', experienceLevel: 'freshers',
    statement: 'Given an unweighted undirected graph, find the shortest distance from node 0 to node N-1. If unreachable, print -1.',
    inputFormat: 'First line: N M.\nNext M lines: u v.',
    outputFormat: 'Print shortest distance or -1.',
    constraints: '2 <= N <= 10^4',
    referenceSolution: `function solve(input) { const lines = input.trim().split('\\n'); const [n,m] = lines[0].split(/\\s+/).map(Number); const adj = Array.from({length:n},()=>[]); for(let i=1;i<=m;i++){const[u,v]=lines[i].split(/\\s+/).map(Number);adj[u].push(v);adj[v].push(u);} const dist=Array(n).fill(-1); dist[0]=0; const q=[0]; while(q.length){const node=q.shift();adj[node].forEach(nb=>{if(dist[nb]===-1){dist[nb]=dist[node]+1;q.push(nb);}});} console.log(dist[n-1]); }`,
    testCases: [{ input: '5 5\n0 1\n1 2\n2 3\n3 4\n0 4', output: '1', isHidden: false }, { input: '4 2\n0 1\n2 3', output: '-1', isHidden: true }] },
  // ─── EXPERIENCED ───
  { title: 'Number of Islands', difficulty: 'medium', experienceLevel: 'experienced',
    statement: 'Given a 2D grid of 1s (land) and 0s (water), count the number of islands (connected 1s horizontally/vertically).',
    inputFormat: 'First line: M N.\nNext M lines: N space-separated integers (0 or 1).',
    outputFormat: 'Print number of islands.',
    constraints: '1 <= M, N <= 300',
    referenceSolution: `function solve(input) { const lines = input.trim().split('\\n'); const [m,n] = lines[0].split(/\\s+/).map(Number); const grid=[]; for(let i=1;i<=m;i++) grid.push(lines[i].split(/\\s+/).map(Number)); let count=0; function dfs(r,c){if(r<0||r>=m||c<0||c>=n||grid[r][c]===0)return;grid[r][c]=0;dfs(r+1,c);dfs(r-1,c);dfs(r,c+1);dfs(r,c-1);} for(let i=0;i<m;i++)for(let j=0;j<n;j++){if(grid[i][j]===1){count++;dfs(i,j);}} console.log(count); }`,
    testCases: [{ input: '4 5\n1 1 0 0 0\n1 1 0 0 0\n0 0 1 0 0\n0 0 0 1 1', output: '3', isHidden: false }, { input: '1 1\n1', output: '1', isHidden: true }] },
  { title: 'Topological Sort (Kahn)', difficulty: 'medium', experienceLevel: 'experienced',
    statement: 'Given a DAG with N nodes and M edges, print one valid topological ordering.',
    inputFormat: 'First line: N M.\nNext M lines: u v (directed edge u → v).',
    outputFormat: 'Print topological order space-separated.',
    constraints: '1 <= N <= 10^4',
    referenceSolution: `function solve(input) { const lines = input.trim().split('\\n'); const [n,m] = lines[0].split(/\\s+/).map(Number); const adj = Array.from({length:n},()=>[]); const indeg = Array(n).fill(0); for(let i=1;i<=m;i++){const[u,v]=lines[i].split(/\\s+/).map(Number);adj[u].push(v);indeg[v]++;} const q=[]; for(let i=0;i<n;i++)if(indeg[i]===0)q.push(i); const res=[]; while(q.length){const node=q.shift();res.push(node);adj[node].forEach(nb=>{indeg[nb]--;if(indeg[nb]===0)q.push(nb);})} console.log(res.join(' ')); }`,
    testCases: [{ input: '6 6\n5 2\n5 0\n4 0\n4 1\n2 3\n3 1', output: '4 5 0 2 3 1', isHidden: false }, { input: '3 2\n0 1\n1 2', output: '0 1 2', isHidden: true }] },
  { title: 'Dijkstra Shortest Path', difficulty: 'medium', experienceLevel: 'experienced',
    statement: 'Given a weighted directed graph, find shortest distance from node 0 to all other nodes. Print distances space-separated. Use -1 for unreachable.',
    inputFormat: 'First line: N M.\nNext M lines: u v w (edge from u to v with weight w).',
    outputFormat: 'Print shortest distances from node 0 to nodes 0,1,...,N-1 space-separated.',
    constraints: '1 <= N <= 10^4\n0 <= w <= 10^6',
    referenceSolution: `function solve(input) { const lines = input.trim().split('\\n'); const [n,m] = lines[0].split(/\\s+/).map(Number); const adj = Array.from({length:n},()=>[]); for(let i=1;i<=m;i++){const[u,v,w]=lines[i].split(/\\s+/).map(Number);adj[u].push([v,w]);} const dist=Array(n).fill(Infinity); dist[0]=0; const pq=[[0,0]]; while(pq.length){pq.sort((a,b)=>a[1]-b[1]);const[node,d]=pq.shift();if(d>dist[node])continue;adj[node].forEach(([nb,w])=>{if(dist[node]+w<dist[nb]){dist[nb]=dist[node]+w;pq.push([nb,dist[nb]]);}});} console.log(dist.map(d=>d===Infinity?-1:d).join(' ')); }`,
    testCases: [{ input: '5 6\n0 1 4\n0 2 1\n2 1 2\n1 3 1\n2 3 5\n3 4 3', output: '0 3 1 4 7', isHidden: false }, { input: '3 1\n0 1 5', output: '0 5 -1', isHidden: true }] },
  { title: 'Course Schedule (Cycle in DAG)', difficulty: 'medium', experienceLevel: 'experienced',
    statement: 'Given N courses and prerequisites, determine if all courses can be completed. Print "YES" or "NO".',
    inputFormat: 'First line: N M.\nNext M lines: a b (to take a, must first take b).',
    outputFormat: 'Print "YES" if possible, else "NO".',
    constraints: '1 <= N <= 2000',
    referenceSolution: `function solve(input) { const lines = input.trim().split('\\n'); const [n,m] = lines[0].split(/\\s+/).map(Number); const adj = Array.from({length:n},()=>[]); const indeg = Array(n).fill(0); for(let i=1;i<=m;i++){const[a,b]=lines[i].split(/\\s+/).map(Number);adj[b].push(a);indeg[a]++;} const q=[]; for(let i=0;i<n;i++)if(indeg[i]===0)q.push(i); let count=0; while(q.length){const node=q.shift();count++;adj[node].forEach(nb=>{indeg[nb]--;if(indeg[nb]===0)q.push(nb);})} console.log(count===n?'YES':'NO'); }`,
    testCases: [{ input: '4 4\n1 0\n2 0\n3 1\n3 2', output: 'YES', isHidden: false }, { input: '2 2\n0 1\n1 0', output: 'NO', isHidden: true }] },
  { title: 'Clone Graph', difficulty: 'medium', experienceLevel: 'experienced',
    statement: 'Given an adjacency list of an undirected graph, output the same adjacency list (proving deep copy). Each line i has neighbors of node i.',
    inputFormat: 'First line: N.\nNext N lines: space-separated neighbors of node i (0-indexed).',
    outputFormat: 'Print same adjacency list (one line per node).',
    constraints: '1 <= N <= 100',
    referenceSolution: `function solve(input) { const lines = input.trim().split('\\n'); const n = parseInt(lines[0]); for(let i=1;i<=n;i++) console.log(lines[i].trim()); }`,
    testCases: [{ input: '4\n1 3\n0 2\n1 3\n0 2', output: '1 3\n0 2\n1 3\n0 2', isHidden: false }, { input: '1\n', output: '', isHidden: true }] },
  { title: 'Minimum Spanning Tree (Kruskal)', difficulty: 'hard', experienceLevel: 'experienced',
    statement: 'Given a weighted undirected graph, find the total weight of the Minimum Spanning Tree.',
    inputFormat: 'First line: N M.\nNext M lines: u v w.',
    outputFormat: 'Print the total MST weight.',
    constraints: '2 <= N <= 10^4',
    referenceSolution: `function solve(input) { const lines = input.trim().split('\\n'); const [n,m] = lines[0].split(/\\s+/).map(Number); const edges=[]; for(let i=1;i<=m;i++){const[u,v,w]=lines[i].split(/\\s+/).map(Number);edges.push([w,u,v]);} edges.sort((a,b)=>a[0]-b[0]); const parent=Array.from({length:n},(_,i)=>i); function find(x){if(parent[x]!==x)parent[x]=find(parent[x]);return parent[x];} let total=0,count=0; for(const[w,u,v] of edges){const pu=find(u),pv=find(v);if(pu!==pv){parent[pu]=pv;total+=w;count++;if(count===n-1)break;}} console.log(total); }`,
    testCases: [{ input: '4 5\n0 1 10\n0 2 6\n0 3 5\n1 3 15\n2 3 4', output: '19', isHidden: false }, { input: '3 3\n0 1 1\n1 2 2\n0 2 3', output: '3', isHidden: true }] },
];

// ═══════════════════════════════════════════════════════════════════════════════
// DYNAMIC PROGRAMMING
// ═══════════════════════════════════════════════════════════════════════════════
const DYNAMIC_PROGRAMMING: Q[] = [
  // ─── FRESHERS ───
  { title: 'Fibonacci Number', difficulty: 'easy', experienceLevel: 'freshers',
    statement: 'Given N, find the Nth Fibonacci number. F(0)=0, F(1)=1, F(n)=F(n-1)+F(n-2).',
    inputFormat: 'A single integer N.',
    outputFormat: 'Print F(N).',
    constraints: '0 <= N <= 30',
    referenceSolution: `function solve(input) { const n = parseInt(input.trim()); if(n<=1){console.log(n);return;} let a=0,b=1; for(let i=2;i<=n;i++){const c=a+b;a=b;b=c;} console.log(b); }`,
    testCases: [{ input: '10', output: '55', isHidden: false }, { input: '0', output: '0', isHidden: true }, { input: '1', output: '1', isHidden: true }] },
  { title: 'Climbing Stairs', difficulty: 'easy', experienceLevel: 'freshers',
    statement: 'You are climbing a staircase with N steps. Each time you can climb 1 or 2 steps. How many distinct ways can you reach the top?',
    inputFormat: 'A single integer N.',
    outputFormat: 'Print the number of ways.',
    constraints: '1 <= N <= 45',
    referenceSolution: `function solve(input) { const n = parseInt(input.trim()); if(n<=2){console.log(n);return;} let a=1,b=2; for(let i=3;i<=n;i++){const c=a+b;a=b;b=c;} console.log(b); }`,
    testCases: [{ input: '2', output: '2', isHidden: false }, { input: '3', output: '3', isHidden: false }, { input: '5', output: '8', isHidden: true }] },
  { title: 'Maximum Sum of Non-Adjacent Elements', difficulty: 'easy', experienceLevel: 'freshers',
    statement: 'Given an array of N positive integers, find the maximum sum of elements such that no two selected elements are adjacent.',
    inputFormat: 'First line: N.\nSecond line: N integers.',
    outputFormat: 'Print the maximum sum.',
    constraints: '1 <= N <= 10^5',
    referenceSolution: `function solve(input) { const lines = input.trim().split('\\n'); const n = parseInt(lines[0]); const arr = lines[1].trim().split(/\\s+/).map(Number); if(n===1){console.log(arr[0]);return;} let prev2=0,prev1=0; for(const x of arr){const curr=Math.max(prev1,prev2+x);prev2=prev1;prev1=curr;} console.log(prev1); }`,
    testCases: [{ input: '6\n5 5 10 100 10 5', output: '110', isHidden: false }, { input: '3\n1 2 3', output: '4', isHidden: true }] },
  { title: 'Min Cost Climbing Stairs', difficulty: 'easy', experienceLevel: 'freshers',
    statement: 'Given an array cost where cost[i] is the cost of step i, find minimum cost to reach the top. You can start from step 0 or 1.',
    inputFormat: 'First line: N.\nSecond line: N integers (costs).',
    outputFormat: 'Print minimum cost.',
    constraints: '2 <= N <= 1000',
    referenceSolution: `function solve(input) { const lines = input.trim().split('\\n'); const n = parseInt(lines[0]); const cost = lines[1].trim().split(/\\s+/).map(Number); for(let i=2;i<n;i++) cost[i]+=Math.min(cost[i-1],cost[i-2]); console.log(Math.min(cost[n-1],cost[n-2])); }`,
    testCases: [{ input: '3\n10 15 20', output: '15', isHidden: false }, { input: '10\n1 100 1 1 1 100 1 1 100 1', output: '6', isHidden: true }] },
  { title: 'Count Ways to Make Change', difficulty: 'easy', experienceLevel: 'freshers',
    statement: 'Given coins of different denominations and a total amount, find the number of combinations that make up that amount.',
    inputFormat: 'First line: amount.\nSecond line: space-separated coin denominations.',
    outputFormat: 'Print number of combinations.',
    constraints: '0 <= amount <= 5000\n1 <= coins.length <= 12',
    referenceSolution: `function solve(input) { const lines = input.trim().split('\\n'); const amount = parseInt(lines[0]); const coins = lines[1].trim().split(/\\s+/).map(Number); const dp = Array(amount+1).fill(0); dp[0]=1; for(const coin of coins) for(let i=coin;i<=amount;i++) dp[i]+=dp[i-coin]; console.log(dp[amount]); }`,
    testCases: [{ input: '5\n1 2 5', output: '4', isHidden: false }, { input: '3\n2', output: '0', isHidden: true }] },
  { title: 'House Robber', difficulty: 'easy', experienceLevel: 'freshers',
    statement: 'Given N houses with money, you cannot rob two adjacent houses. Find maximum money you can rob.',
    inputFormat: 'First line: N.\nSecond line: N integers.',
    outputFormat: 'Print maximum amount.',
    constraints: '1 <= N <= 100',
    referenceSolution: `function solve(input) { const lines = input.trim().split('\\n'); const n = parseInt(lines[0]); const nums = lines[1].trim().split(/\\s+/).map(Number); if(n===1){console.log(nums[0]);return;} let p2=0,p1=0; for(const x of nums){const c=Math.max(p1,p2+x);p2=p1;p1=c;} console.log(p1); }`,
    testCases: [{ input: '4\n1 2 3 1', output: '4', isHidden: false }, { input: '5\n2 7 9 3 1', output: '12', isHidden: true }] },
  // ─── EXPERIENCED ───
  { title: '0/1 Knapsack Problem', difficulty: 'medium', experienceLevel: 'experienced',
    statement: 'Given N items with weights and values, and a knapsack capacity W, find the maximum value that fits in the knapsack.',
    inputFormat: 'First line: N W.\nNext N lines: value weight.',
    outputFormat: 'Print maximum value.',
    constraints: '1 <= N <= 100\n1 <= W <= 1000',
    referenceSolution: `function solve(input) { const lines = input.trim().split('\\n'); const [n,W] = lines[0].split(/\\s+/).map(Number); const items=[]; for(let i=1;i<=n;i++){const[v,w]=lines[i].split(/\\s+/).map(Number);items.push([v,w]);} const dp=Array(W+1).fill(0); for(const[v,w] of items) for(let j=W;j>=w;j--) dp[j]=Math.max(dp[j],dp[j-w]+v); console.log(dp[W]); }`,
    testCases: [{ input: '3 50\n60 10\n100 20\n120 30', output: '220', isHidden: false }, { input: '4 7\n1 1\n4 3\n5 4\n7 5', output: '9', isHidden: true }] },
  { title: 'Longest Common Subsequence', difficulty: 'medium', experienceLevel: 'experienced',
    statement: 'Given two strings, find the length of their longest common subsequence.',
    inputFormat: 'First line: string S1.\nSecond line: string S2.',
    outputFormat: 'Print the length of LCS.',
    constraints: '1 <= |S1|, |S2| <= 1000',
    referenceSolution: `function solve(input) { const lines = input.trim().split('\\n'); const s1=lines[0].trim(),s2=lines[1].trim(); const m=s1.length,n=s2.length; const dp=Array(m+1).fill(null).map(()=>Array(n+1).fill(0)); for(let i=1;i<=m;i++) for(let j=1;j<=n;j++) dp[i][j]=s1[i-1]===s2[j-1]?dp[i-1][j-1]+1:Math.max(dp[i-1][j],dp[i][j-1]); console.log(dp[m][n]); }`,
    testCases: [{ input: 'abcde\nace', output: '3', isHidden: false }, { input: 'abc\nabc', output: '3', isHidden: true }] },
  { title: 'Longest Increasing Subsequence', difficulty: 'medium', experienceLevel: 'experienced',
    statement: 'Given an array of N integers, find the length of the longest strictly increasing subsequence.',
    inputFormat: 'First line: N.\nSecond line: N integers.',
    outputFormat: 'Print the length of LIS.',
    constraints: '1 <= N <= 2500',
    referenceSolution: `function solve(input) { const lines = input.trim().split('\\n'); const n = parseInt(lines[0]); const arr = lines[1].trim().split(/\\s+/).map(Number); const dp=Array(n).fill(1); for(let i=1;i<n;i++) for(let j=0;j<i;j++) if(arr[j]<arr[i]) dp[i]=Math.max(dp[i],dp[j]+1); console.log(Math.max(...dp)); }`,
    testCases: [{ input: '8\n10 9 2 5 3 7 101 18', output: '4', isHidden: false }, { input: '4\n7 7 7 7', output: '1', isHidden: true }] },
  { title: 'Coin Change (Minimum Coins)', difficulty: 'medium', experienceLevel: 'experienced',
    statement: 'Given coins and an amount, find the fewest number of coins to make up that amount. If not possible, print -1.',
    inputFormat: 'First line: amount.\nSecond line: space-separated coin denominations.',
    outputFormat: 'Print minimum coins or -1.',
    constraints: '0 <= amount <= 10^4',
    referenceSolution: `function solve(input) { const lines = input.trim().split('\\n'); const amount = parseInt(lines[0]); const coins = lines[1].trim().split(/\\s+/).map(Number); const dp=Array(amount+1).fill(Infinity); dp[0]=0; for(let i=1;i<=amount;i++) for(const c of coins) if(c<=i) dp[i]=Math.min(dp[i],dp[i-c]+1); console.log(dp[amount]===Infinity?-1:dp[amount]); }`,
    testCases: [{ input: '11\n1 5 6', output: '2', isHidden: false, explanation: '5+6=11' }, { input: '3\n2', output: '-1', isHidden: true }] },
  { title: 'Matrix Chain Multiplication', difficulty: 'hard', experienceLevel: 'experienced',
    statement: 'Given dimensions of N matrices, find the minimum number of multiplications needed to multiply them all.',
    inputFormat: 'First line: N.\nSecond line: N+1 integers (dimensions array).',
    outputFormat: 'Print minimum multiplications.',
    constraints: '2 <= N <= 100',
    referenceSolution: `function solve(input) { const lines = input.trim().split('\\n'); const n = parseInt(lines[0]); const p = lines[1].trim().split(/\\s+/).map(Number); const dp=Array(n).fill(null).map(()=>Array(n).fill(0)); for(let len=2;len<=n;len++) for(let i=0;i<=n-len;i++){const j=i+len-1;dp[i][j]=Infinity;for(let k=i;k<j;k++) dp[i][j]=Math.min(dp[i][j],dp[i][k]+dp[k+1][j]+p[i]*p[k+1]*p[j+1]);} console.log(dp[0][n-1]); }`,
    testCases: [{ input: '4\n10 30 5 60 10', output: '7000', isHidden: false }, { input: '3\n40 20 30 10', output: '26000', isHidden: true }] },
  { title: 'Partition Equal Subset Sum', difficulty: 'medium', experienceLevel: 'experienced',
    statement: 'Given an array of positive integers, determine if it can be partitioned into two subsets with equal sum. Print "YES" or "NO".',
    inputFormat: 'First line: N.\nSecond line: N integers.',
    outputFormat: 'Print "YES" or "NO".',
    constraints: '1 <= N <= 200\n1 <= nums[i] <= 100',
    referenceSolution: `function solve(input) { const lines = input.trim().split('\\n'); const n = parseInt(lines[0]); const nums = lines[1].trim().split(/\\s+/).map(Number); const total = nums.reduce((a,b)=>a+b,0); if(total%2!==0){console.log('NO');return;} const target=total/2; const dp=Array(target+1).fill(false); dp[0]=true; for(const num of nums) for(let j=target;j>=num;j--) dp[j]=dp[j]||dp[j-num]; console.log(dp[target]?'YES':'NO'); }`,
    testCases: [{ input: '4\n1 5 11 5', output: 'YES', isHidden: false }, { input: '3\n1 2 3', output: 'YES', isHidden: true }, { input: '3\n1 2 5', output: 'NO', isHidden: true }] },
  { title: 'Word Break (DP)', difficulty: 'medium', experienceLevel: 'experienced',
    statement: 'Given a string and dictionary, determine if string can be segmented into space-separated dictionary words.',
    inputFormat: 'First line: string S.\nSecond line: space-separated dictionary words.',
    outputFormat: 'Print "YES" or "NO".',
    constraints: '1 <= |S| <= 300',
    referenceSolution: `function solve(input) { const lines = input.trim().split('\\n'); const s = lines[0].trim(); const dict = new Set(lines[1].trim().split(/\\s+/)); const n=s.length; const dp=Array(n+1).fill(false); dp[0]=true; for(let i=1;i<=n;i++) for(let j=0;j<i;j++) if(dp[j]&&dict.has(s.substring(j,i))){dp[i]=true;break;} console.log(dp[n]?'YES':'NO'); }`,
    testCases: [{ input: 'leetcode\nleet code', output: 'YES', isHidden: false }, { input: 'catsandog\ncats dog sand and cat', output: 'NO', isHidden: true }] },
  { title: 'Unique Paths in Grid', difficulty: 'medium', experienceLevel: 'experienced',
    statement: 'Given an M x N grid, find number of unique paths from top-left to bottom-right (can only move right or down).',
    inputFormat: 'A single line: M N.',
    outputFormat: 'Print number of unique paths.',
    constraints: '1 <= M, N <= 100',
    referenceSolution: `function solve(input) { const [m,n] = input.trim().split(/\\s+/).map(Number); const dp=Array(m).fill(null).map(()=>Array(n).fill(1)); for(let i=1;i<m;i++) for(let j=1;j<n;j++) dp[i][j]=dp[i-1][j]+dp[i][j-1]; console.log(dp[m-1][n-1]); }`,
    testCases: [{ input: '3 7', output: '28', isHidden: false }, { input: '3 3', output: '6', isHidden: true }] },
];

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN SEED FUNCTION
// ═══════════════════════════════════════════════════════════════════════════════
async function seedTopic(topicName: string, questions: Q[]) {
  console.log(`\n── Seeding "${topicName}" (${questions.length} questions) ──`);

  // Ensure topic exists in tcs-nqt
  const existing = await prisma.topic.findFirst({ where: { name: topicName, system: 'tcs-nqt' } });
  if (!existing) {
    await prisma.topic.create({ data: { name: topicName, system: 'tcs-nqt', description: `${topicName} problems`, order: 0, isActive: true } });
  }

  let tcsCreated = 0, arenaCreated = 0;

  for (const prob of questions) {
    const tcsSlug = slugify(prob.title) + '-' + prob.experienceLevel + '-' + slugify(topicName) + '-tcs';
    const arenaSlug = tcsSlug.replace(/-tcs$/, '-arena');

    // 1. Save to TcsNqtQuestion (Placement Prep)
    try {
      const ex = await prisma.tcsNqtQuestion.findUnique({ where: { slug: tcsSlug } });
      if (!ex) {
        await prisma.tcsNqtQuestion.create({
          data: {
            title: prob.title, slug: tcsSlug, difficulty: prob.difficulty, topic: topicName,
            statement: prob.statement, inputFormat: prob.inputFormat, outputFormat: prob.outputFormat,
            constraints: prob.constraints, referenceSolution: prob.referenceSolution,
            testCases: prob.testCases as any,
            companies: prob.experienceLevel === 'experienced' ? 'TCS, Google, Microsoft, Amazon' : 'TCS, Wipro, Infosys, Accenture',
            experienceLevel: prob.experienceLevel, xpReward: 10,
          },
        });
        tcsCreated++;
      }
    } catch (err: any) { console.error(`  ❌ TCS ${prob.title}: ${err.message}`); }

    // 2. Save to Problem table (Coding Arena) — AUTO SYNC
    try {
      const exP = await prisma.problem.findUnique({ where: { slug: arenaSlug } });
      if (!exP) {
        await prisma.problem.create({
          data: {
            title: prob.title, slug: arenaSlug, difficulty: prob.difficulty,
            statement: prob.statement, constraints: prob.constraints,
            inputFormat: prob.inputFormat, outputFormat: prob.outputFormat,
            timeLimit: 2000, memoryLimit: 256,
            starterCode: { javascript: '// Write your code', python: '# Write your code', java: '// Write your code', cpp: '// Write your code' },
            referenceSolution: prob.referenceSolution,
            topics: topicName, companies: 'TCS, Wipro, Infosys',
            tags: '', category: prob.experienceLevel, isArchived: false,
            testCases: {
              create: prob.testCases.map((tc, idx) => ({
                input: tc.input, expectedOutput: tc.output,
                isHidden: tc.isHidden ?? false, type: tc.isHidden ? 'hidden' : 'sample',
                explanation: tc.explanation || null, order: idx,
              })),
            },
          },
        });
        arenaCreated++;
      }
    } catch (err: any) { console.error(`  ❌ Arena ${prob.title}: ${err.message}`); }
  }

  console.log(`  ✅ TCS NQT: ${tcsCreated} created | Coding Arena: ${arenaCreated} created`);
}

async function main() {
  console.log('🌱 Seeding Linked List, Trees, Graphs, Dynamic Programming...');

  await seedTopic('Linked List', LINKED_LIST);
  await seedTopic('Trees', TREES);
  await seedTopic('Graphs', GRAPHS);
  await seedTopic('Dynamic Programming', DYNAMIC_PROGRAMMING);

  // Final counts
  const tcsTotal = await prisma.tcsNqtQuestion.count();
  const arenaTotal = await prisma.problem.count({ where: { isArchived: false } });
  console.log('\n══════════════════════════════════════════');
  console.log(`🎉 DONE!`);
  console.log(`   TcsNqtQuestion total: ${tcsTotal}`);
  console.log(`   Problem (Coding Arena) total: ${arenaTotal}`);
  console.log('══════════════════════════════════════════\n');
}

main()
  .catch(err => { console.error('Fatal:', err); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });

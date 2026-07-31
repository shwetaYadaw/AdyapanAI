# Questions Data Structure

This directory contains all platform questions organized by source and topic.

## Directory Structure

```
data/questions/
├── tcs-nqt/          # TCS NQT preparation questions (102 total)
│   ├── arrays.json
│   ├── numbers.json
│   ├── strings.json
│   ├── sorting.json
│   └── number-systems.json
│
└── coding-arena/     # Coding Arena DSA problems (443 total)
    ├── arrays.json
    ├── strings.json
    ├── hashing.json
    ├── linked-list.json
    ├── trees.json
    ├── graphs.json
    ├── dynamic-programming.json
    ├── recursion-backtracking.json
    ├── heap-priority-queue.json
    ├── stack.json
    ├── queue-deque.json
    ├── bit-manipulation.json
    ├── searching-sorting.json
    ├── binary-search.json
    ├── binary-search-tree.json
    ├── trie.json
    ├── segment-tree-fenwick.json
    ├── two-pointers.json
    ├── sliding-window.json
    ├── dfs-bfs.json
    └── greedy.json
```

## JSON File Format

Each JSON file follows this structure:

```json
{
  "metadata": {
    "source": "tcs-nqt" or "coding-arena",
    "topic": "arrays",
    "version": "1.0.0",
    "lastUpdated": "2026-07-31",
    "questionCount": 10
  },
  "questions": [
    {
      "title": "Question Title",
      "difficulty": "easy|medium|hard",
      "statement": "Full problem statement...",
      "inputFormat": "Input format description",
      "outputFormat": "Output format description",
      "constraints": "Constraints...",
      "sampleInput": "Sample input",
      "sampleOutput": "Sample output",
      "testCases": [
        {
          "input": "input1",
          "output": "output1",
          "isHidden": false
        }
      ]
    }
  ]
}
```

## How to Add/Edit Questions

### Option 1: Edit JSON directly
- Edit the relevant JSON file in your IDE
- Run seed script: `npm run seed:questions`
- Changes reflected immediately

### Option 2: Use Admin API
- POST/PUT to `/api/v1/admin/questions`
- Questions stored in database
- Changes live immediately

### Option 3: Bulk import
- Place JSON files in this directory
- Run: `npm run migrate:questions`
- All questions imported at once

## Seed Scripts

```bash
# Seed all questions
npm run seed:questions

# Seed only TCS NQT
npm run seed:tcs-nqt-json

# Seed only Coding Arena
npm run seed:coding-arena-json

# Migrate from JSON to database
npm run migrate:questions

# Reset and reseed everything
npm run reset:seed:questions
```

## Version Control

- ✅ JSON files are version controlled in Git
- ✅ Easy to review changes in diffs
- ✅ Enables collaborative editing
- ✅ Keeps all history

## Database Schema

Questions table with new fields:
- `source`: "tcs-nqt" | "coding-arena" (for filtering/organization)
- `category`: "arrays", "strings", etc. (for grouping)
- All existing fields maintained for backward compatibility

## Migration Status

- [x] TCS NQT converted to JSON (data/questions/tcs-nqt/)
- [ ] Coding Arena to be converted
- [ ] Admin API endpoints created
- [ ] Seed scripts unified
- [ ] Old hardcoded scripts kept as reference

## Notes

- Questions are the source of truth
- Database is the runtime storage
- JSON files are backed up in Git
- No hardcoding of questions anywhere

# Topic Management System - Admin Guide

## Overview

The Topic Management System allows admins to dynamically add, edit, delete, and reorder topics across three main systems:
- **Coding Arena** (Blue) - DSA problems for top MNC companies
- **TCS NQT** (Orange) - TCS-specific coding and placement questions  
- **Aptitude** (Green) - General aptitude questions for all companies

## Key Features

✅ **Dynamic Topic Management** - Add/edit/delete topics without hardcoding
✅ **Database Persistence** - All topics stored in PostgreSQL
✅ **Topic Dropdowns** - Admins select from predefined topics when creating questions
✅ **Reordering** - Change topic display order with up/down buttons
✅ **Activation/Deactivation** - Toggle topics as active/inactive

## How to Access Topic Management

1. Go to `/admin` route in your browser
2. You'll see three system cards: Coding Arena, TCS NQT, and Aptitude
3. Click the **"Manage Topics"** button in the top-right corner
4. Select the system you want to manage topics for

## Adding a New Topic

1. Open Topic Management Modal
2. Select the system from the dropdown (if available, or it defaults to the last selected)
3. Enter the topic name (e.g., "Graph Theory", "Sets")
4. Optionally add a description
5. Click **"Add Topic"** button
6. Topic will appear in the list immediately

## Editing a Topic

1. In the Topic Management Modal, find the topic to edit
2. Click the **Edit** icon (pencil icon)
3. Modify the topic name and/or description
4. Click **"Save"** to update
5. Click **"Cancel"** to discard changes

## Deleting a Topic

1. Find the topic in the list
2. Click the **Delete** icon (trash icon)
3. Confirm the deletion
4. Topic will be removed immediately

## Reordering Topics

Topics appear in the dropdowns in the order they're displayed in the management list.

- Click **Up Arrow** to move a topic up in the list
- Click **Down Arrow** to move a topic down in the list
- The first topic can't be moved up
- The last topic can't be moved down

## Using Topics When Creating Questions

### Coding Arena
1. Click "Add Coding Arena Problem" button
2. In the modal, you'll see a **Topic** dropdown
3. Select a topic from the list (populated from database)
4. The topics are ordered as you set them in Topic Management

### TCS NQT
1. Click "Add TCS NQT Question" button
2. In the modal, you'll see a **Topic** dropdown
3. Select a topic from the list (populated from database)

### Aptitude
1. Click "Add Aptitude Question" button
2. In the modal, you'll see a **Topic** dropdown
3. Select a topic from the list (populated from database)

## Default Topics

When you first set up the system, you can seed default topics by calling the **seed endpoint**:

**Backend API:**
```bash
POST /api/v1/admin/topics/bulk/seed
```

This creates the following topics:

### Coding Arena (22 topics)
Arrays, Strings, Linked List, Trees, Graphs, Dynamic Programming, Hashing, Stack, Queue, Recursion, Backtracking, Greedy, Binary Search, Bit Manipulation, Segment Tree, Fenwick Tree, Trie, Two Pointers, Sliding Window, Heap/Priority Queue, DFS/BFS, Sorting

### TCS NQT (17 topics)
Quantitative Aptitude, Verbal Reasoning, Logical Reasoning, English, Reading Comprehension, Problem Solving, Time & Work, Profit & Loss, Percentage, Simple Interest, Compound Interest, Algebra, Geometry, Trigonometry, Data Interpretation, Permutation & Combination, Probability

### Aptitude (16 topics)
Quantitative Aptitude, Verbal Reasoning, Logical Reasoning, Data Interpretation, Puzzles, Numbers, Percentages, Time & Distance, Time & Work, Profit & Loss, Ratios & Proportions, Averages, Permutation & Combination, Probability, Geometry, Algebra

## API Endpoints

### Get Topics
```
GET /api/v1/admin/topics?system=coding-arena&activeOnly=true
```

**Parameters:**
- `system` (required): 'coding-arena', 'tcs-nqt', or 'aptitude'
- `activeOnly` (optional): 'true' to fetch only active topics, default is false

**Response:**
```json
[
  {
    "id": "uuid-1",
    "name": "Arrays",
    "system": "coding-arena",
    "description": "Arrays problems for top MNC companies",
    "isActive": true,
    "order": 0,
    "createdAt": "2026-08-02T...",
    "updatedAt": "2026-08-02T..."
  },
  ...
]
```

### Create Topic
```
POST /api/v1/admin/topics
Authorization: Bearer <admin-token>
```

**Body:**
```json
{
  "name": "Arrays",
  "system": "coding-arena",
  "description": "Optional description",
  "order": 0
}
```

### Update Topic
```
PUT /api/v1/admin/topics/:id
Authorization: Bearer <admin-token>
```

**Body:**
```json
{
  "name": "New Name",
  "description": "New description",
  "isActive": true,
  "order": 5
}
```

### Delete Topic
```
DELETE /api/v1/admin/topics/:id
Authorization: Bearer <admin-token>
```

### Seed Default Topics
```
POST /api/v1/admin/topics/bulk/seed
Authorization: Bearer <admin-token>
```

### Reorder Topics
```
PUT /api/v1/admin/topics/bulk/reorder
Authorization: Bearer <admin-token>
```

**Body:**
```json
{
  "topics": [
    { "id": "uuid-1", "order": 0 },
    { "id": "uuid-2", "order": 1 },
    { "id": "uuid-3", "order": 2 }
  ]
}
```

## Database Schema

### Topic Table
```sql
CREATE TABLE "Topic" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL,
    "system" TEXT NOT NULL,  -- 'coding-arena', 'tcs-nqt', 'aptitude'
    "description" TEXT,
    "isActive" BOOLEAN DEFAULT true,
    "order" INTEGER DEFAULT 0,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP,
    
    CONSTRAINT unique_name_system UNIQUE(name, system)
);

CREATE INDEX idx_system ON "Topic"(system);
CREATE INDEX idx_active_system ON "Topic"(isActive, system);
```

## Best Practices

1. **Consistency** - Use the same naming convention across topics (e.g., capitalize first letter)
2. **Organization** - Group related topics together by reordering
3. **Documentation** - Add meaningful descriptions for complex topics
4. **Review Before Delete** - Make sure no questions depend on a topic before deleting
5. **Regular Updates** - Add new topics as your content library grows

## Troubleshooting

### Topics Not Appearing in Dropdown
- Ensure the topic's `isActive` flag is set to true
- Check if the system filter matches (coding-arena, tcs-nqt, or aptitude)
- Verify the topic was created successfully in the Topic Management Modal

### Can't Add a New Topic
- Check that the topic name doesn't already exist for that system
- Verify you have admin privileges
- Ensure you're authenticated

### Backend Error When Fetching Topics
- Verify the database migration was applied (`prisma migrate dev`)
- Check the system name is spelled correctly in the query parameter
- Look at backend logs for detailed error messages

## Advanced: Seeding Topics via Script

Run the seed script to populate default topics:

```bash
cd apps/backend
npx ts-node scripts/seed-topics.ts
```

This will create all default topics for all three systems if they don't already exist.

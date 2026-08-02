# Admin Quick Start Guide - Topic Management

## 🚀 Quick Access

1. **Go to Admin Dashboard**: `/admin`
2. **Click "Manage Topics"** button (top-right)
3. Done! Start managing topics

## 📋 5-Minute Setup

### Step 1: Add Your First Topic

```
System: Coding Arena (Blue)
Topic Name: "Binary Trees"
Description: "Problems involving binary tree traversal and manipulation"
Click: "Add Topic"
```

✅ Topic added! You'll see it in the list.

### Step 2: Reorder Topics

Want to move "Binary Trees" up in the dropdown list?
- Click the **⬆️ Up Arrow** to move it up
- Click the **⬇️ Down Arrow** to move it down

### Step 3: Use in Questions

Now create a question:
1. Go to Coding Arena Dashboard
2. Click "Add Coding Arena Problem"
3. In the form, you'll see **Topic** dropdown
4. Select "Binary Trees"
5. Fill other fields and save

🎉 Done! Your question is now tagged with "Binary Trees"

## 🎯 Common Tasks

### Add a Topic
1. Click "Manage Topics"
2. Enter name in "Topic name" field
3. Click "Add Topic"

### Edit a Topic
1. Find the topic in the list
2. Click the ✏️ **Edit** icon
3. Modify and click "Save"

### Delete a Topic
1. Find the topic in the list
2. Click the 🗑️ **Delete** icon
3. Confirm deletion

### Reorder Topics
1. Find the topic in the list
2. Click ⬆️ or ⬇️ to move up/down

### Change System
- In Topic Management modal, select different system from dropdown
- Or use the section header to switch

## 📊 Topic Counts

| System | Count | Default Topics |
|--------|-------|-----------------|
| Coding Arena | 22 | Arrays, Strings, Trees, Graphs, DP, etc. |
| TCS NQT | 17 | Quantitative, Verbal, Logical, etc. |
| Aptitude | 16 | Quantitative, Verbal, Reasoning, etc. |

## 🔄 System Flow

```
Admin Dashboard
    ↓
[Manage Topics] Button
    ↓
Topic Management Modal
    ├─ Coding Arena Topics
    ├─ TCS NQT Topics
    └─ Aptitude Topics
         ↓
    Create Question
         ↓
    Select Topic (from dropdown)
         ↓
    Save Question
         ↓
    Question stored with topic
```

## ⚡ Keyboard Shortcuts

Coming soon! (Currently use mouse clicks)

## ❓ FAQ

### Q: Can I add the same topic name to multiple systems?
**A:** Yes! "Quantitative" can exist in TCS NQT AND Aptitude. They're tracked separately.

### Q: What if I delete a topic?
**A:** Only the topic is deleted. Questions with that topic won't be affected.
*Note: In a future update, we can add referential integrity checks.*

### Q: Can I restore a deleted topic?
**A:** Not yet. Be careful when deleting!

### Q: Do I need to restart the app?
**A:** No! Topics are updated live. Just refresh if you don't see changes.

### Q: Can non-admins manage topics?
**A:** No. Only admin users can access topic management.

### Q: How many topics can I have?
**A:** Unlimited! Add as many as you need.

## 🎨 System Colors

- 🔵 **Coding Arena** - Blue
- 🟠 **TCS NQT** - Orange
- 🟢 **Aptitude** - Green

## 📱 Works On

- ✅ Desktop
- ✅ Tablet
- ✅ Mobile (responsive UI)

## 🔐 Permissions

**Required:** Admin role
**Authentication:** Bearer token (JWT)
**Scope:** Can manage all topics across all systems

## 💾 Data Storage

All topics are stored in PostgreSQL database:
- Encrypted passwords ✅
- Automatic timestamps ✅
- Unique constraint (no duplicates per system) ✅
- Persistent across server restarts ✅

## 🐛 Troubleshooting

### Topics not showing in dropdown?
- ✅ Refresh the page
- ✅ Check browser console (F12 → Console)
- ✅ Verify topic is active (not inactive)

### Can't add a topic?
- ✅ Check if topic already exists for that system
- ✅ Make sure you're logged in as admin
- ✅ Check backend is running (port 5000)

### Modal won't open?
- ✅ Try refreshing the page
- ✅ Clear browser cache
- ✅ Check browser console for errors

## 📞 Support

Need help? Check these docs:
- Detailed guide: `TOPIC_MANAGEMENT_GUIDE.md`
- Implementation details: `DYNAMIC_TOPICS_IMPLEMENTATION.md`
- API reference: See TOPIC_MANAGEMENT_GUIDE.md → API Endpoints section

## 🎓 Learning Paths

### Beginner
1. Add 3 new topics to Coding Arena
2. Add 2 questions with new topics
3. Reorder topics
4. Done! ✅

### Intermediate
1. Manage topics for all 3 systems
2. Edit topic descriptions
3. Delete unused topics
4. Test with questions from all systems

### Advanced
1. Use API endpoints directly (curl/Postman)
2. Seed default topics with script
3. Bulk reorder via API
4. Write custom admin scripts

## 📈 Best Practices

1. **Consistency** - Use title case for topic names
2. **Organization** - Group similar topics together
3. **Naming** - Use clear, searchable names
4. **Descriptions** - Add context for admins
5. **Review** - Check topic list before deleting

## ✨ Pro Tips

- 💡 Use descriptive names (e.g., "Dynamic Programming" not "DP")
- 💡 Add descriptions for context
- 💡 Group related topics together
- 💡 Regularly review and remove unused topics
- 💡 Use consistent naming across systems

## 🔗 Related Pages

- Admin Dashboard: `/admin`
- Coding Arena: `/admin` → Click "Coding Arena"
- TCS NQT: `/admin` → Click "TCS NQT"
- Aptitude: `/admin` → Click "Aptitude"

## 📝 Changelog

### v1.0 (Current)
- ✅ Add/Edit/Delete topics
- ✅ Reorder topics
- ✅ Database persistence
- ✅ Three-system support
- ✅ Default topics included

### Coming Soon v1.1
- 🔄 Bulk import from CSV
- 🔄 Topic search/filter
- 🔄 Topic statistics
- 🔄 Soft delete with restore
- 🔄 Topic templates

---

**Questions?** See the detailed guide in `TOPIC_MANAGEMENT_GUIDE.md` or check the API documentation.

**Ready?** Go to `/admin` and click "Manage Topics"! 🚀

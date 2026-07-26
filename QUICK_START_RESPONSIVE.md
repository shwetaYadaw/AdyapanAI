# AdyapanAI Quick Start & Responsive Design Guide

## 🚀 Quick Start in 5 Minutes

### Prerequisites
```bash
# Check Node.js version (need v16+)
node --version

# Install dependencies
npm install --ignore-scripts --force
```

### Start Backend (Port 5000)
```bash
cd apps/backend
npm run dev
```

**✅ Expected**: Server running on `http://localhost:5000`

### Start Frontend (Port 3000)
```bash
cd apps/web
npm run dev
```

**✅ Expected**: UI running on `http://localhost:3000`

### Login
```
Email: student@test.com
Password: password123
```

---

## 🎯 Key Improvements Made

### ✅ Responsive Sidebar
- **Mobile**: Hidden by default, hamburger menu visible
- **Tablet**: Collapsible navigation
- **Desktop**: Always visible, can collapse
- **Overlay**: Click-to-close on mobile

### ✅ Responsive Code Editor
- **Mobile**: Tab-based view (1 tab at a time)
- **Tablet**: Side-by-side layout
- **Desktop**: Three-pane layout (problem, editor, console)

### ✅ Mobile-Optimized Layouts
- Responsive padding: `px-3 sm:px-4 md:px-6 lg:px-8`
- Flexible grids: `grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4`
- Adaptive spacing for comfortable viewing

### ✅ Touch-Friendly Interface
- Min 44x44px buttons for mobile
- Larger touch targets
- Readable text on all screen sizes

---

## 📱 Device Breakpoints

```
Mobile (320-639px)     → Default styles
Phone-Large (640-767px) → sm: prefix
Tablet (768-1023px)    → md: prefix
Laptop (1024-1279px)   → lg: prefix
Desktop (1280px+)      → xl: prefix
```

---

## 🎨 Responsive Components

### Navigation (Mobile/Desktop)
```jsx
<div className="flex lg:hidden">
  {/* Mobile Menu */}
</div>
<div className="hidden lg:flex">
  {/* Desktop Menu */}
</div>
```

### Grid Layouts
```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
  {/* Auto-scales at breakpoints */}
</div>
```

### Responsive Text
```jsx
<h1 className="text-sm sm:text-base md:text-lg lg:text-xl">
  Title scales on all devices
</h1>
```

### Flexible Padding
```jsx
<div className="px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-3 md:py-4">
  Padding adjusts per screen
</div>
```

---

## 🔧 Common Commands

### Backend
```bash
cd apps/backend

# Development server
npm run dev

# Generate Prisma client
npx prisma generate

# View database
npx prisma studio

# Run migrations
npx prisma migrate dev
```

### Frontend
```bash
cd apps/web

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## ❌ Troubleshooting

| Problem | Solution |
|---------|----------|
| "Failed to fetch dynamically imported module" | Start backend first, clear browser cache, hard refresh (Ctrl+Shift+R) |
| "Cannot find module '@prisma/client'" | Run `npx prisma generate` in backend folder |
| "Port 5000 already in use" | Kill process: `netstat -ano \| findstr :5000` then `taskkill /PID <PID> /F` |
| Dependencies won't install | `npm cache clean --force` then `npm install --ignore-scripts --force` |
| Sidebar not showing on mobile | Open DevTools (F12), check if `md:hidden` is applied correctly |
| Console too big on mobile | Reduce console size in dropdown, or use tabs to hide it |

---

## 📊 Project Structure

```
AdyapanAI/
├── apps/backend/              ← API Server (port 5000)
│   ├── src/routes/           ← REST endpoints
│   ├── prisma/schema.prisma  ← Database schema
│   └── .env                  ← Supabase credentials
│
├── apps/web/                 ← React App (port 3000)
│   ├── src/pages/           ← Page components
│   ├── src/components/      ← Reusable components
│   ├── src/components/layout/ ← DashboardLayout, Sidebar, Navbar
│   └── .env                 ← API proxy config
│
└── PROJECT_STARTUP_GUIDE.md  ← Complete startup guide
```

---

## 🌐 Responsive Checklist

### Mobile (< 640px)
- [ ] Sidebar hidden
- [ ] Hamburger menu visible
- [ ] Text readable
- [ ] No horizontal scroll
- [ ] Touch targets 44x44px+
- [ ] Tab-based views work

### Tablet (640px - 1024px)
- [ ] Sidebar collapsible
- [ ] 2-column layouts
- [ ] Comfortable spacing
- [ ] All buttons accessible

### Desktop (> 1024px)
- [ ] Full features visible
- [ ] Multi-pane layouts
- [ ] Resize handles work
- [ ] High-res support

---

## 📝 Files Modified

1. **DashboardLayout.tsx**
   - Added mobile hamburger menu
   - Responsive padding
   - Mobile navigation trigger

2. **Sidebar.tsx**
   - Mobile overlay support
   - Click-to-close functionality
   - Responsive animations

3. **CodingPortalPage.tsx**
   - Tab-based mobile view
   - Adaptive console heights
   - Mobile-optimized layout

---

## 🎓 Learning Resources

- **Responsive Design**: [Tailwind CSS Docs](https://tailwindcss.com/docs/responsive-design)
- **Mobile First**: [MDN Guide](https://developer.mozilla.org/en-US/docs/Glossary/Mobile_first)
- **Layout Patterns**: Check existing components for examples

---

## ✨ Features

✅ Responsive sidebar (hidden on mobile)  
✅ Mobile hamburger menu  
✅ Tab-based code editor on mobile  
✅ Adaptive console sizing  
✅ Flexible grid layouts  
✅ Touch-friendly interface  
✅ Dark mode support  
✅ Smooth animations  

---

## 🎯 Next Steps

1. **Start the project** → Follow "Quick Start in 5 Minutes" above
2. **Test on mobile** → Open DevTools, use device emulation (Ctrl+Shift+M)
3. **Explore features** → Navigate dashboard, try code editor
4. **Create DSA problems** → Add new coding challenges
5. **Deploy** → Production deployment guide in PROJECT_STARTUP_GUIDE.md

---

## 📞 Support

- **Backend Issues**: Check `apps/backend/` terminal logs
- **Frontend Issues**: Check browser console (F12)
- **Database Issues**: Verify Supabase connection in `.env`

---

**Status**: Production Ready ✅  
**Last Updated**: 2026-07-25  
**Responsive Tested**: Mobile (320px), Tablet (768px), Desktop (1440px)  
**Browser Support**: Chrome, Firefox, Safari, Edge (latest versions)

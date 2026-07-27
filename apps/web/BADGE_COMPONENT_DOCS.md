# Badge Component Documentation

## Overview

The Badge system is a comprehensive React component suite with Adyapan branding designed to display user achievements, skills, milestones, streaks, challenges, and expert badges.

**Features:**
- ✅ 6 badge types with distinct styling
- ✅ Adyapan logo integration
- ✅ Level/tier system
- ✅ Responsive design
- ✅ Filter and statistics
- ✅ Smooth animations
- ✅ TypeScript support

---

## Components

### 1. Badge Component

Individual badge display component with Adyapan logo.

**File:** `src/components/common/Badge.tsx`

**Props:**

```typescript
interface BadgeProps {
  badgeType: 'achievement' | 'skill' | 'milestone' | 'streak' | 'challenge' | 'expert';
  name: string;
  description?: string;
  unlockedAt?: Date;
  level?: number;
  showLogo?: boolean;
}
```

**Usage:**

```jsx
import Badge from './components/common/Badge';

<Badge
  badgeType="achievement"
  name="First Submission"
  description="Successfully submitted your first solution"
  unlockedAt={new Date('2024-01-15')}
  level={1}
  showLogo={true}
/>
```

**Badge Types:**

| Type | Icon | Color | Use Case |
|------|------|-------|----------|
| achievement | 🏆 | Gold/Yellow | General accomplishments |
| skill | ⭐ | Purple | Language/domain expertise |
| milestone | 🎯 | Green | Major milestones reached |
| streak | 🔥 | Red | Consistency achievements |
| challenge | 💪 | Blue | Challenge completions |
| expert | 👑 | Pink | Expert status/rankings |

---

### 2. BadgeDisplay Component

Container component showing multiple badges with filtering and statistics.

**File:** `src/components/common/BadgeDisplay.tsx`

**Props:**

```typescript
interface BadgeDisplayProps {
  badges: BadgeData[];
  title?: string;
  showStats?: boolean;
}

interface BadgeData {
  id: string;
  badgeType: 'achievement' | 'skill' | 'milestone' | 'streak' | 'challenge' | 'expert';
  name: string;
  description?: string;
  unlockedAt?: Date;
  level?: number;
}
```

**Usage:**

```jsx
import BadgeDisplay from './components/common/BadgeDisplay';

const badges = [
  {
    id: '1',
    badgeType: 'achievement',
    name: 'First Submission',
    description: 'Successfully submitted your first solution',
    unlockedAt: new Date('2024-01-15'),
    level: 1,
  },
  // ... more badges
];

<BadgeDisplay 
  badges={badges}
  title="Your Badges"
  showStats={true}
/>
```

**Features:**
- Filter by badge type
- Display total badges count
- Average level calculation
- Responsive grid layout
- Empty state handling

---

## Badge Types Detailed

### Achievement Badges 🏆
Golden badges for general accomplishments
- First Submission
- Accepted Solutions
- Consistent Solver
- Problem Marathon

### Skill Badges ⭐
Purple badges for technical expertise
- JavaScript Master
- Python Expert
- C++ Programmer
- Full Stack Developer

### Milestone Badges 🎯
Green badges for major achievements
- 100 Problems Solved
- 1000 Problems Solved
- Speed Runner
- No Looking Back

### Streak Badges 🔥
Red badges for consistency
- 7-Day Streak
- 30-Day Streak
- 100-Day Streak
- Unbreakable Focus

### Challenge Badges 💪
Blue badges for challenge completion
- Hard Mode
- Algorithm Master
- Data Structures Pro
- Interview Ready

### Expert Badges 👑
Pink badges for elite status
- Data Structures Expert
- Algorithm Grandmaster
- Adyapan Champion
- Hall of Fame

---

## Styling

### CSS Files

**Badge.css** - Individual badge styling
- Badge container with hover effects
- Circle design with Adyapan logo
- Level badge positioning
- Type-specific color schemes
- Responsive design
- Pop animation

**BadgeDisplay.css** - Display container styling
- Header with title and stats
- Filter tabs
- Grid layout
- No-badges empty state
- Responsive breakpoints

### Color Palette

```css
Achievement:  #FFC107 (Yellow/Gold)
Skill:        #9C27B0 (Purple)
Milestone:    #4CAF50 (Green)
Streak:       #F44336 (Red)
Challenge:    #2196F3 (Blue)
Expert:       #E91E63 (Pink)
Adyapan:      #FFA500 (Orange)
```

---

## Responsive Behavior

### Desktop (>768px)
- 3-column grid layout
- Full-size badges (100px circle)
- All details visible
- Horizontal layout

### Tablet (481px - 768px)
- 2-column grid layout
- Medium-size badges (80px circle)
- Compact font sizes
- Flexible layout

### Mobile (<480px)
- Single column layout
- Vertical card layout
- Small badges (70px circle)
- Stack all content
- Center alignment

---

## Animations

### Pop Animation
```css
@keyframes badge-pop {
  0% { transform: scale(0); opacity: 0; }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
}
```
Duration: 0.4s ease-out
Triggered on: Component mount

### Hover Effect
- Translate Y: -4px
- Shadow enhancement
- Border color highlight
- Smooth 0.3s transition

### Filter Tab Active
- Gradient background
- Color change
- Border highlight
- Smooth transition

---

## Integration

### With User Profile

```jsx
import BadgeDisplay from './components/common/BadgeDisplay';
import { fetchUserBadges } from './services/api';

const UserProfile = ({ userId }) => {
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    fetchUserBadges(userId).then(setBadges);
  }, [userId]);

  return (
    <div className="profile">
      <ProfileHeader />
      <BadgeDisplay badges={badges} title="Achievements" />
    </div>
  );
};
```

### With Achievements System

```jsx
const achievementUnlocked = (type, name, description) => {
  showNotification(`🎉 Badge Unlocked: ${name}`);
  addBadge({
    id: generateId(),
    badgeType: type,
    name,
    description,
    unlockedAt: new Date(),
    level: 1,
  });
};

// On successful submission
achievementUnlocked(
  'achievement',
  'First Submission',
  'Successfully submitted your first solution'
);
```

---

## State Management

### Using React Hooks

```jsx
const [badges, setBadges] = useState<BadgeData[]>([]);
const [filter, setFilter] = useState<string>('all');

const filteredBadges = filter === 'all'
  ? badges
  : badges.filter(b => b.badgeType === filter);
```

### Using Redux (Optional)

```typescript
// actions/badgeActions.ts
export const fetchBadges = () => async (dispatch) => {
  const badges = await api.getBadges();
  dispatch({ type: 'SET_BADGES', payload: badges });
};

// selectors/badgeSelectors.ts
export const selectFilteredBadges = (state) =>
  state.badges.filtered;
```

---

## API Integration

### Fetch User Badges

```typescript
// services/badgeService.ts
export const fetchUserBadges = async (userId: string): Promise<BadgeData[]> => {
  const response = await fetch(`/api/users/${userId}/badges`);
  return response.json();
};

// Usage
useEffect(() => {
  fetchUserBadges(userId).then(setBadges);
}, [userId]);
```

### Unlock Badge

```typescript
export const unlockBadge = async (badgeType: string, name: string): Promise<BadgeData> => {
  const response = await fetch('/api/badges/unlock', {
    method: 'POST',
    body: JSON.stringify({ badgeType, name }),
  });
  return response.json();
};
```

---

## Accessibility

### ARIA Labels

```jsx
<div
  role="badge"
  aria-label={`${name} badge, unlocked on ${unlockedAt}`}
  className="badge-circle"
>
  {/* content */}
</div>
```

### Keyboard Navigation

- Tab: Navigate through badges
- Enter: Show badge details
- Escape: Close details modal

### Color Contrast

- All text meets WCAG AA standards
- Logo has sufficient contrast ratio
- Icon visibility guaranteed

---

## Performance

### Optimization Techniques

1. **Memoization**
```jsx
const Badge = React.memo(BadgeComponent);
```

2. **Lazy Loading**
```jsx
const BadgeDisplay = React.lazy(() => 
  import('./BadgeDisplay')
);
```

3. **Virtual Scrolling** (for large lists)
```jsx
import { FixedSizeList } from 'react-window';
```

### Bundle Size

- Badge.tsx: ~3KB
- Badge.css: ~8KB
- BadgeDisplay.tsx: ~4KB
- BadgeDisplay.css: ~6KB
- **Total: ~21KB** (minified/gzipped)

---

## Customization

### Custom Badge Type

```jsx
// Extend the badgeType union
type CustomBadgeType = 'achievement' | 'skill' | 'custom';

// Add to switch statement
const getBadgeColor = (type: string) => {
  switch(type) {
    case 'custom':
      return 'badge-custom';
    // ...
  }
};

// Add CSS
.badge-custom {
  background: linear-gradient(135deg, #color1 0%, #color2 100%);
}
```

### Custom Icons

```jsx
const getBadgeIcon = (type: string): string => {
  const iconMap = {
    achievement: '🏆',
    skill: '⭐',
    custom: '🎨', // Custom icon
  };
  return iconMap[type] || '🎖️';
};
```

---

## Examples

### Example 1: Display User Badges

```jsx
import BadgeDisplay from './components/common/BadgeDisplay';

export const UserBadgesSection = ({ userId }) => {
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    // Fetch from API
    api.getUserBadges(userId).then(setBadges);
  }, [userId]);

  return (
    <BadgeDisplay 
      badges={badges}
      title={`${userName}'s Badges`}
      showStats={true}
    />
  );
};
```

### Example 2: Badge Notification

```jsx
import Badge from './components/common/Badge';
import { useNotification } from './hooks';

const handleProblemSolved = async () => {
  const result = await submitSolution();
  if (result.badgeUnlocked) {
    showNotification(
      <Badge
        badgeType={result.badge.badgeType}
        name={result.badge.name}
        description="You just unlocked a new badge!"
        showLogo={true}
      />
    );
  }
};
```

### Example 3: Achievement Progress

```jsx
const [badges, setBadges] = useState([]);
const totalBadges = badges.length;
const expertBadges = badges.filter(b => b.badgeType === 'expert').length;
const progress = (expertBadges / 5) * 100; // 5 expert badges to max

<ProgressBar value={progress} label={`Expert Status: ${expertBadges}/5`} />
<BadgeDisplay badges={badges} />
```

---

## Troubleshooting

### Issue: Badges not displaying
- Check badge data structure matches interface
- Verify CSS imports are correct
- Ensure React is version 16.8+

### Issue: Logo not showing
- Set `showLogo={true}` prop
- Check CSS file is imported
- Verify Adyapan font styling

### Issue: Animations not working
- Check browser supports CSS animations
- Verify animation keyframes are in CSS
- Check for CSS conflicts

---

## File Structure

```
src/components/common/
├── Badge.tsx                 # Individual badge component
├── Badge.css                 # Badge styling
├── BadgeDisplay.tsx          # Badge container component
├── BadgeDisplay.css          # Container styling
└── BadgesPage.tsx            # Example page

src/services/
└── badgeService.ts           # API integration

src/hooks/
└── useBadges.ts              # Custom hook (optional)
```

---

## Future Enhancements

- [ ] Badge animations on unlock
- [ ] 3D badge flip effect
- [ ] Sharing badges on social media
- [ ] Badge trading/gifting system
- [ ] Leaderboard integration
- [ ] Badge progression tracking
- [ ] Seasonal badges
- [ ] Custom badge creator

---

## Support

For issues or suggestions:
1. Check the troubleshooting section
2. Review the examples
3. Check component props
4. Verify CSS imports

---

**Version:** 1.0.0
**Last Updated:** January 2024
**Maintained by:** AdyapanAI Frontend Team

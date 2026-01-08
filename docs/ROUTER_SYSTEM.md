# Router System Documentation

## Overview

The Router system provides centralized navigation management with browser history support, route guards, and proper URL handling.

## Files

- **`src/utils/Router.js`** - Core router class with History API integration
- **`src/config/routes.js`** - Route definitions and access control guards
- **`src/main-new.js`** - Router initialization and integration

## Features

### 1. Browser History Integration
- ✅ Back/forward button support
- ✅ Bookmark-able URLs using hash routing
- ✅ Programmatic navigation with `router.navigate()`

### 2. Route Guards
- ✅ Access control for protected routes
- ✅ Automatic redirects for unauthorized access
- ✅ Extensible guard system

### 3. Route Management
- ✅ Centralized route registration
- ✅ Route change listeners
- ✅ Dynamic page titles

## Usage

### Basic Navigation

```javascript
import { router } from './utils/Router.js';
import { RoutePaths } from './config/routes.js';

// Navigate to a route
router.navigate(RoutePaths.PROFILE);

// Navigate with data
router.navigate(RoutePaths.STORY_MISSION, { missionId: 'tutorial_1' });

// Replace current history entry (no back button)
router.navigate(RoutePaths.HOME, {}, true);
```

### Browser Navigation

```javascript
// Go back
router.back();

// Go forward
router.forward();

// Get current route
const current = router.getCurrentRoute();
console.log(current.path, current.data);
```

### Adding New Routes

1. **Define the route path** in `src/config/routes.js`:

```javascript
export const RoutePaths = {
  // ... existing paths
  MY_NEW_FEATURE: '/my-feature',
};
```

2. **Create a route guard** (optional):

```javascript
export const RouteGuards = {
  // ... existing guards
  myFeatureUnlocked: () => {
    const saveData = SaveManager.load();
    return saveData.profile.level >= 10; // Example: require level 10
  },
};
```

3. **Add route to config** in `getRouteConfig()`:

```javascript
{
  path: RoutePaths.MY_NEW_FEATURE,
  handler: handlers.showMyFeature,
  guard: 'myFeatureUnlocked', // optional
  title: 'My Feature - Legends of the Arena',
}
```

4. **Create the handler function** in `main-new.js`:

```javascript
function showMyFeature() {
  const root = document.getElementById('root');
  root.innerHTML = '';
  
  const screen = document.createElement('my-feature-screen');
  screen.addEventListener('back', () => {
    router.navigate(RoutePaths.HOME);
  });
  
  root.appendChild(screen);
}
```

5. **Register in route handlers** object:

```javascript
const handlers = {
  // ... existing handlers
  showMyFeature,
};
```

### Listening to Route Changes

```javascript
// Subscribe to route changes
const unsubscribe = router.onChange(({ path, data }) => {
  console.log('Route changed to:', path, data);
});

// Unsubscribe when done
unsubscribe();
```

## Route Guards

Current guards available:

- **`characterCreated`** - Checks if player has created a character
- **`minimumLevel`** - Requires specific player level (pass `minLevel` in data)
- **`regionUnlocked`** - Checks if story region is unlocked
- **`missionUnlocked`** - Checks if story mission is unlocked
- **`tournamentUnlocked`** - Requires level 5+

## Available Routes

| Path | Guard | Description |
|------|-------|-------------|
| `/` | None | Main menu / title screen |
| `/character-creation` | None | Character creation |
| `/profile` | characterCreated | Player profile screen |
| `/achievements` | characterCreated | Achievements list |
| `/settings` | None | Game settings |
| `/wiki` | None | Game wiki/guides |
| `/opponent-selection` | characterCreated | Single combat opponent selection |
| `/combat` | characterCreated | Combat arena |
| `/tournament/bracket` | characterCreated | Tournament bracket |
| `/story` | characterCreated | Story mode campaign map |
| `/story/mission` | characterCreated | Mission briefing |
| `/marketplace` | characterCreated | Marketplace shop |
| `/equipment` | characterCreated | Equipment management (future) |

## Benefits

### Before Router
- ❌ No browser back button support
- ❌ Scattered navigation logic
- ❌ No access control
- ❌ Hard to test navigation flows

### After Router
- ✅ Full browser history support
- ✅ Centralized navigation
- ✅ Route guards for access control
- ✅ Easy to test and extend
- ✅ Better user experience

## Migration Notes

All navigation has been updated from:
```javascript
showTitleScreen();
```

To:
```javascript
router.navigate(RoutePaths.HOME);
```

This provides:
- Consistent navigation API
- Browser history entries
- Access control enforcement
- Better code organization

## Future Enhancements

Potential improvements for Phase 2+:
- Query string parameter support
- Nested routes
- Route animations/transitions
- Loading states
- Error boundaries
- Route prefetching

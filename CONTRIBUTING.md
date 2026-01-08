# Contributing to Legends of the Arena 🎮

First off, thank you for considering contributing to Legends of the Arena! It's people like you that make this game even better. 🙌

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Guidelines](#coding-guidelines)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)

---

## 📜 Code of Conduct

This project and everyone participating in it is governed by respect and professionalism. By participating, you are expected to uphold this code.

---

## 🤝 How Can I Contribute?

### Reporting Bugs 🐛

Before creating bug reports, please check the [issue tracker](https://github.com/todorivanov/ObjectFighterJS/issues) to see if the problem has already been reported.

**When creating a bug report, include:**
- **Clear title** and description
- **Steps to reproduce** the issue
- **Expected behavior** vs **actual behavior**
- **Screenshots** if applicable
- **Browser version** and OS
- **Console errors** (F12 → Console tab)

### Suggesting Features ✨

Feature suggestions are welcome! Please:
- Check if the feature has already been suggested
- Provide a clear use case and benefit
- Include mockups or examples if possible
- Explain how it fits with the game's design

### Code Contributions 💻

We welcome code contributions! Here's what we need help with:

**High Priority:**
- Bug fixes
- Performance improvements
- Mobile responsiveness
- Accessibility improvements

**Features:**
- New character classes
- New equipment items
- Story mode missions
- Skills and abilities
- UI/UX enhancements

---

## 🛠️ Development Setup

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- Git

### Installation

1. **Fork the repository** on GitHub

2. **Clone your fork:**
```bash
git clone https://github.com/YOUR-USERNAME/ObjectFighterJS.git
cd ObjectFighterJS
```

3. **Add upstream remote:**
```bash
git remote add upstream https://github.com/todorivanov/ObjectFighterJS.git
```

4. **Install dependencies:**
```bash
npm install
```

5. **Start development server:**
```bash
npm run dev
```

6. **Open in browser:**
Navigate to `http://localhost:5173`

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Check for linting errors
npm run lint:fix     # Auto-fix linting errors
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
npm run check        # Run all checks (lint + format)
npm run clean        # Remove dist and node_modules
```

---

## 📝 Coding Guidelines

### Code Style

We use **ESLint** and **Prettier** for consistent code style:

```bash
# Before committing, run:
npm run check
```

### JavaScript Standards

- **ES6+ syntax** - Use modern JavaScript features
- **No jQuery** - Vanilla JavaScript only
- **Web Components** - For UI components
- **JSDoc comments** - Document all functions/classes
- **Meaningful names** - Clear variable and function names

### File Organization

```
src/
├── api/           # Mock data and API simulation
├── components/    # Web Components (UI)
├── config/        # Game configuration
├── data/          # Game data (equipment, classes, etc.)
├── entities/      # Game entities (Fighter, Team, etc.)
├── game/          # Game logic and managers
├── styles/        # CSS stylesheets
└── utils/         # Utility functions
```

### Component Structure

```javascript
/**
 * MyComponent Web Component
 * Brief description of what this component does
 * 
 * Events:
 * - event-name: Description of event
 * 
 * Attributes:
 * - attribute-name: Description
 */
export class MyComponent extends BaseComponent {
  constructor() {
    super();
    // Initialize component state
  }

  styles() {
    return `/* Component styles */`;
  }

  template() {
    return `<!-- Component HTML -->`;
  }

  attachEventListeners() {
    // Set up event listeners
  }
}

customElements.define('my-component', MyComponent);
```

### Game Systems

When adding new game systems:
1. Create a manager class in `src/game/`
2. Use `SaveManager` for persistent data
3. Emit events via `EventManager`
4. Document all public methods with JSDoc
5. Add corresponding guide in `guides/`

### Data Structure

New equipment, classes, or items should follow existing patterns:

```javascript
// Example: Adding new equipment
{
  id: 'unique_id',
  name: 'Display Name',
  type: 'weapon|armor|accessory',
  rarity: 'common|rare|epic|legendary',
  stats: {
    strength: 10,
    health: 50,
    // ... other stats
  },
  requirements: {
    level: 5,
    class: ['WARRIOR', 'TANK'], // Optional
  },
  durability: {
    max: 100,
    degradationRate: 8,
    repairCostBase: 20,
  },
  icon: '⚔️',
  description: 'Item description',
}
```

---

## 💬 Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
<type>(<scope>): <subject>

# Types:
feat:     New feature
fix:      Bug fix
docs:     Documentation changes
style:    Code style changes (formatting, etc.)
refactor: Code refactoring
perf:     Performance improvements
test:     Adding tests
chore:    Build process or auxiliary tool changes
```

**Examples:**
```bash
feat(combat): add berserker class with rage mechanic
fix(marketplace): prevent selling equipped items
docs(readme): update installation instructions
refactor(fighter): simplify stat calculation
perf(rendering): optimize combat log rendering
style(ui): improve button hover animations
```

---

## 🔄 Pull Request Process

1. **Create a new branch:**
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

2. **Make your changes:**
- Follow coding guidelines
- Add JSDoc comments
- Update documentation if needed
- Test thoroughly

3. **Commit your changes:**
```bash
git add .
git commit -m "feat(scope): description"
```

4. **Keep your fork updated:**
```bash
git fetch upstream
git rebase upstream/main
```

5. **Push to your fork:**
```bash
git push origin feature/your-feature-name
```

6. **Open a Pull Request:**
- Use a clear title following commit conventions
- Describe what changes you made and why
- Reference any related issues (#123)
- Include screenshots for UI changes
- Ensure all checks pass (lint, format)

### PR Checklist

Before submitting, ensure:
- [ ] Code follows project style guidelines
- [ ] JSDoc comments added for new functions
- [ ] `npm run check` passes without errors
- [ ] Game runs without console errors
- [ ] Changes are tested in browser
- [ ] Documentation updated if needed
- [ ] Commit messages follow conventions

---

## 🎨 Asset Contributions

### Icons & Emojis
We primarily use Unicode emojis for icons. If adding new items:
- Use appropriate emojis that fit the theme
- Ensure they display correctly across platforms
- Keep consistent sizing with existing items

### Images
- Optimize images before committing
- Use appropriate formats (PNG for UI, JPG for photos)
- Keep file sizes reasonable (<100KB when possible)

---

## 📚 Documentation

When adding features:
1. Update relevant sections in `README.md`
2. Add detailed guide in `guides/` directory
3. Update in-game Wiki (`WikiScreen.js`)
4. Include JSDoc comments in code

---

## ❓ Questions?

Feel free to:
- Open an [issue](https://github.com/todorivanov/ObjectFighterJS/issues)
- Start a [discussion](https://github.com/todorivanov/ObjectFighterJS/discussions)
- Reach out to maintainers

---

## 🙏 Recognition

Contributors will be:
- Listed in `README.md`
- Credited in release notes
- Given public thanks for their work

Thank you for contributing to Legends of the Arena! 🎮⚔️

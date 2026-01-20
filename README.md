# ObjectFighterJS - React Version

A modern rebuild of ObjectFighterJS using React, TypeScript, Vite, Ant Design, and SCSS.

## Tech Stack

- **React 19.2** - UI framework
- **TypeScript** - Type safety
- **Vite 7.2** - Build tool with rolldown
- **Ant Design 6.2** - UI component library
- **SCSS** - Styling
- **SWC** - Fast TypeScript/JSX compilation

## Project Structure

```
src/
├── components/     # React components
├── hooks/          # Custom React hooks
├── services/       # API and business logic
├── styles/         # Global styles and variables
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
├── App.tsx         # Main app component
└── main.tsx        # Entry point
```

## Getting Started

### Install Dependencies

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Development Plan

This is a clean rebuild from scratch. Features will be added incrementally:

1. ✅ Project setup with React + TypeScript + Vite
2. ✅ Ant Design and SCSS integration
3. 🔄 Core game components (to be added)
4. 🔄 Game logic and state management (to be added)
5. 🔄 UI/UX improvements (to be added)

## Notes

- Using rolldown-vite for faster builds
- Ant Design configured with custom theme
- SCSS variables set up for consistent styling
- Clean folder structure ready for feature development
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

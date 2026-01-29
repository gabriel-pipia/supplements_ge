# Contributing to Supplement.ge

Thank you for your interest in contributing to Supplement.ge! This document provides guidelines and instructions for contributing.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Style](#code-style)
- [Commit Messages](#commit-messages)
- [Pull Requests](#pull-requests)
- [Reporting Issues](#reporting-issues)

## 📜 Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- Expo CLI
- Git

### Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/supplements_ge.git
   cd supplements_ge
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm start
   ```

## 💻 Development Workflow

### Branch Naming

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions/updates

Example: `feature/add-wishlist-sharing`

### Testing Changes

- Run on iOS Simulator: `npm run ios`
- Run on Android Emulator: `npm run android`
- Run on Web: `npm run web`

### Type Checking

```bash
npm run type-check
```

## 📝 Code Style

### TypeScript

- Use TypeScript for all new files
- Define proper interfaces for props and state
- Avoid `any` types when possible
- Use meaningful variable names

### React Components

```tsx
// ✅ Good: Functional component with typed props
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ title, onPress, variant = 'primary' }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text>{title}</Text>
    </TouchableOpacity>
  );
};
```

### Styling

- Use StyleSheet.create for styles
- Follow the theme system for colors
- Keep styles close to components

```tsx
// ✅ Good
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});

// In component
<View style={[styles.container, { backgroundColor: colors.background }]}>
```

### File Organization

```
components/
├── common/
│   ├── Button.tsx        # Main component
│   ├── Button.web.tsx    # Web-specific version (if needed)
│   └── index.ts          # Exports
```

## 📨 Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance

### Examples

```
feat(cart): add quantity selector to cart items
fix(auth): resolve login form validation issue
docs(readme): update installation instructions
refactor(modal): extract BottomSheet to reusable component
```

## 🔄 Pull Requests

### Before Submitting

1. Ensure your code follows the style guide
2. Run type checking: `npm run type-check`
3. Test on at least one platform (iOS/Android/Web)
4. Update documentation if needed

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested on iOS
- [ ] Tested on Android
- [ ] Tested on Web

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
```

## 🐛 Reporting Issues

### Bug Reports

Include:
- Clear description
- Steps to reproduce
- Expected vs actual behavior
- Platform (iOS/Android/Web)
- Device/simulator info
- Screenshots if applicable

### Feature Requests

Include:
- Use case description
- Proposed solution
- Alternatives considered

## 📬 Contact

For questions, reach out via:
- GitHub Issues
- Email: support@supplements.ge

---

Thank you for contributing! 🙏

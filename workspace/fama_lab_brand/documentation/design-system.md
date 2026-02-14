# FAMA.LAB Design System Documentation

## Version 1.0 | 2024

---

## Table of Contents
1. [Introduction](#introduction)
2. [Design Principles](#design-principles)
3. [Color System](#color-system)
4. [Typography System](#typography-system)
5. [Spacing System](#spacing-system)
6. [Components](#components)
7. [Patterns](#patterns)
8. [Accessibility](#accessibility)
9. [Implementation](#implementation)

---

## Introduction

### What is the Design System?
The FAMA.LAB Design System is a comprehensive collection of reusable components, patterns, and guidelines that ensure consistency across all FAMA.LAB products and experiences.

### Goals
- **Consistency** - Uniform experience across all touchpoints
- **Efficiency** - Faster development through reusable components
- **Quality** - Premium, accessible, and polished UI
- **Scalability** - Foundation for future growth

### Scope
- Web applications
- Mobile apps (iOS & Android)
- Marketing materials
- Internal tools
- Partner integrations

---

## Design Principles

### 1. Elegance in Simplicity
Every element should be purposeful and refined. Remove the unnecessary; focus on what matters.

### 2. Premium Aesthetics
The gold accent system conveys quality and attention to detail. Use it purposefully.

### 3. Content-First
Design serves content, not the other way around. Prioritize readability and clarity.

### 4. Consistency
When users encounter similar patterns, they should behave the same way.

### 5. Accessibility First
All components meet WCAG 2.1 AA standards. Design for everyone.

---

## Color System

### Core Colors

```
Brand Gold    ██████████ #c9a962
Light Gold    ██████████ #e5d4a1
Dark Background ██████ #0a0a0a
Surface       ██████ #111111
Primary Text  ████ #f5f5f5
```

### Color Roles

| Role | Token | Light Mode | Dark Mode |
|------|-------|------------|-----------|
| Background | `--color-bg-primary` | #ffffff | #0a0a0a |
| Surface | `--color-bg-surface` | #f5f5f5 | #111111 |
| Text Primary | `--color-text-primary` | #0a0a0a | #f5f5f5 |
| Text Secondary | `--color-text-secondary` | #666666 | #a0a0a0 |
| Accent | `--color-accent` | #c9a962 | #c9a962 |

### Usage Guidelines

**Gold Accent Usage:**
- CTAs (Buttons, links)
- Active states
- Icons and indicators
- Borders and dividers
- Gradients and backgrounds (sparingly)

**Never use gold for:**
- Large text blocks (use dark on light)
- Error/success states (use semantic colors)
- Small sizes below 12px

---

## Typography System

### Font Stack

```css
--font-primary: 'Playfair Display', Georgia, serif;
--font-secondary: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-mono: 'SF Mono', Consolas, monospace;
```

### Type Scale

| Level | Size | Line Height | Letter Spacing |
|-------|------|-------------|----------------|
| Display | 72px | 1.1 | -0.02em |
| H1 | 48px | 1.2 | -0.01em |
| H2 | 36px | 1.3 | 0 |
| H3 | 24px | 1.4 | 0 |
| H4 | 20px | 1.5 | 0 |
| Body 1 | 16px | 1.6 | 0 |
| Body 2 | 14px | 1.5 | 0 |
| Caption | 12px | 1.4 | 0.01em |

### Font Weights

| Weight | Value | Usage |
|--------|-------|-------|
| Regular | 400 | Body text |
| Medium | 500 | Subtitles, emphasis |
| Semi-Bold | 600 | Labels, subheaders |
| Bold | 700 | Headings, CTAs |

### Best Practices

1. **Headings:** Use Playfair Display, bold (700)
2. **Body:** Use Inter, regular (400)
3. **Captions:** Use Inter, regular (400), smaller size
4. **Avoid:** Italics, all caps (except labels)

---

## Spacing System

### Base Unit: 8px

All spacing multiples of 4px:
```
4px  8px  12px  16px  20px  24px  32px  40px  48px  64px  80px  96px
```

### Spacing Tokens

```css
--space-1: 4px;   /* Tight */
--space-2: 8px;   /* Standard gap */
--space-3: 12px;  /* Small padding */
--space-4: 16px;  /* Component padding */
--space-5: 20px;  /* Medium */
--space-6: 24px;  /* Section padding */
--space-8: 32px;  /* Large gap */
--space-10: 40px; /* Section */
--space-12: 48px; /* Hero padding */
--space-16: 64px; /* Page margins */
```

### Layout Grid

**Desktop (≥1024px):**
- Columns: 12
- Gutter: 24px
- Margin: 48px
- Max width: 1440px

**Tablet (768-1023px):**
- Columns: 8
- Gutter: 16px
- Margin: 32px

**Mobile (<768px):**
- Columns: 4
- Gutter: 16px
- Margin: 16px

---

## Components

### Buttons

#### Primary Button
```css
.btn-primary {
  background: linear-gradient(135deg, #c9a962, #e5d4a1, #c9a962);
  color: #0a0a0a;
  font-weight: 600;
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
}
```

#### Secondary Button
```css
.btn-secondary {
  background: transparent;
  color: #c9a962;
  border: 2px solid #c9a962;
  padding: 10px 22px;
  border-radius: 8px;
}
```

#### Button Sizes

| Size | Height | Padding | Font Size |
|------|--------|---------|-----------|
| Small | 32px | 8px 16px | 14px |
| Medium | 44px | 12px 24px | 16px |
| Large | 52px | 16px 32px | 18px |

### Cards

```css
.card {
  background: #111111;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 24px;
}
```

### Inputs

```css
.input {
  background: #141414;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 12px 16px;
  color: #f5f5f5;
}

.input:focus {
  border-color: #c9a962;
  outline: none;
  box-shadow: 0 0 0 3px rgba(201, 169, 98, 0.2);
}
```

### Icons

**Size Scale:**
- Small: 16px
- Medium: 24px
- Large: 32px
- X-Large: 48px

**Style:**
- 2px stroke weight
- Rounded corners (4px)
- Consistent visual weight

### Navigation

```css
.nav-container {
  background: #0a0a0a;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  height: 64px;
  padding: 0 24px;
}
```

---

## Patterns

### Hero Section

```css
.hero {
  padding: 96px 0;
  text-align: center;
  background: linear-gradient(180deg, #0a0a0a 0%, #111111 100%);
}

.hero-title {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 16px;
}

.hero-subtitle {
  font-size: 18px;
  color: #a0a0a0;
  max-width: 600px;
  margin: 0 auto 32px;
}
```

### Feature Grid

```css
.feature-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  padding: 64px 0;
}
```

### Footer

```css
.footer {
  background: #0a0a0a;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 64px 24px;
}
```

---

## Accessibility

### Contrast Requirements

| Element | Minimum Ratio | Example |
|---------|---------------|---------|
| Text (Large) | 3:1 | Headings, labels |
| Text (Regular) | 4.5:1 | Body text |
| UI Components | 3:1 | Borders, icons |
| Focus Indicators | 3:1 | Visible on all interactive |

### Focus States

All interactive elements must have visible focus state:

```css
:focus-visible {
  outline: 2px solid #c9a962;
  outline-offset: 2px;
}
```

### Touch Targets

- **Minimum:** 44x44px (iOS/Android)
- **Recommended:** 48x48px for frequently used
- **Spacing:** 8px between targets

### Screen Reader Support

- Semantic HTML
- ARIA labels where needed
- `alt` text for images
- `aria-hidden` for decorative icons

---

## Implementation

### Installation

```bash
# npm
npm install @famalab/design-system

# or via CDN
<link rel="stylesheet" href="https://cdn.famalab.com/v1/tokens.css">
```

### CSS Import

```css
@import '@famalab/design-system/tokens.css';
@import '@famalab/design-system/components.css';
```

### React Components

```jsx
import { Button, Card, Input } from '@famalab/design-system';

function App() {
  return (
    <Card>
      <h1>Welcome</h1>
      <Input placeholder="Enter text" />
      <Button variant="primary">Click Me</Button>
    </Card>
  );
}
```

### Versioning

- **Major:** Breaking changes
- **Minor:** New features (backward compatible)
- **Patch:** Bug fixes

### Browser Support

| Browser | Version |
|---------|---------|
| Chrome | 88+ |
| Firefox | 85+ |
| Safari | 14+ |
| Edge | 88+ |

---

## Resources

### Design Files
- Figma: [Link]
- Sketch: [Link]

### Documentation
- Storybook: [Link]
- API Docs: [Link]

### Downloads
- Fonts: [Google Fonts Links]
- Icons: [Icon Library Link]

### Support
- Slack: #design-system
- Email: design-system@famalab.com

---

## Changelog

### v1.0.0 (2024)
- Initial release
- Core tokens and components
- Typography system
- Color system
- Basic components (Button, Card, Input)
- Documentation

---

*FAMA.LAB Design System v1.0 | Last Updated: 2024*

# FAMA.LAB Brand Identity Package

Complete brand identity assets for FAMA.LAB and BATEU, CURTIU mobile app.

## 📁 Project Structure

```
fama_lab_brand/
├── logos/                          # FAMA.LAB Logo Files
│   ├── famalab-logo-primary-dark.svg      # Primary logo (dark BG)
│   ├── famalab-logo-secondary-light.svg   # Secondary logo (light BG)
│   ├── famalab-favicon.svg                # Favicon (32x32)
│   ├── famalab-wordmark.svg               # Wordmark only
│   ├── famalab-icon-only.svg              # Icon version
│   ├── famalab-icon-white.svg             # White icon (light BG)
│   ├── famalab-icon-gold.svg              # Gold icon (gold BG)
│   └── famalab-icon-black.svg             # Black icon (dark BG)
│
├── app-icons/                       # BATEU, CURTIU App Assets
│   ├── bateu-curtiu-app-icon.svg           # Main app icon
│   ├── bateu-curtiu-splash.svg             # Splash screen
│   ├── bateu-curtiu-playstore.svg          # Play Store version
│   └── bateu-curtiu-appstore.svg           # App Store version
│
├── guidelines/                      # Brand Guidelines
│   ├── FAMA_LAB_Brand_Guidelines.md        # Main brand guidelines
│   └── BATEU_CURTIU_Brand_Guidelines.md    # App-specific guidelines
│
├── css/                             # Design Tokens
│   └── famalab-tokens.css                  # CSS variables & design tokens
│
├── documentation/                   # Technical Documentation
│   └── design-system.md                   # Design system documentation
│
└── README.md                        # This file
```

## 🎨 Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Gold | `#c9a962` | Primary brand color |
| Light Gold | `#e5d4a1` | Highlights, gradients |
| Dark | `#0a0a0a` | Primary background |
| Surface | `#111111` | Cards, modals |
| Text | `#f5f5f5` | Primary text |

## 🔤 Typography

- **Headings:** Playfair Display (700 weight)
- **Body:** Inter (400 weight)
- **Font Links:**
  - [Playfair Display](https://fonts.google.com/specimen/Playfair+Display)
  - [Inter](https://fonts.google.com/specimen/Inter)

## 📱 App Icons

### BATEU, CURTIU

| Asset | Size | Format |
|-------|------|--------|
| App Icon | 1024x1024px | SVG |
| Splash Screen | 1024x1024px | SVG |
| Play Store | 180x180px | SVG |
| App Store | 1024x1024px | SVG |

## 📐 Logo Usage

### DO ✅
- Use SVG files for scalability
- Maintain clear space around logo
- Use approved color variations
- Scale proportionally

### DON'T ❌
- Stretch or distort
- Add shadows/effects
- Change colors
- Rotate the logo
- Use below minimum size

### Minimum Sizes
- Digital: 32px width
- Print: 0.5 inches

## 📦 Quick Start

### Web Usage
```html
<link rel="stylesheet" href="css/famalab-tokens.css">
```

### Import Fonts
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
```

### CSS Variables
```css
:root {
  --color-gold: #c9a962;
  --color-gold-light: #e5d4a1;
  --color-background-dark: #0a0a0a;
  --color-background-surface: #111111;
  --color-text-primary: #f5f5f5;
  --font-primary: 'Playfair Display', serif;
  --font-secondary: 'Inter', sans-serif;
}
```

## 📄 Documentation

- **FAMA.LAB Guidelines:** `guidelines/FAMA_LAB_Brand_Guidelines.md`
- **BATEU, CURTIU Guidelines:** `guidelines/BATEU_CURTIU_Brand_Guidelines.md`
- **Design System:** `documentation/design-system.md`

## 🔗 Links

- Figma Design File: [Link]
- Font Downloads: [Google Fonts](https://fonts.google.com)
- Support: brand@famalab.com

---

**Version:** 1.0 | **Last Updated:** 2024

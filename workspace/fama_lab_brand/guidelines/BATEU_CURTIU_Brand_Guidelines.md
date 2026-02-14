# BATEU, CURTIU App Brand Guidelines

## Version 1.0 | 2024

---

## Table of Contents
1. [App Overview](#app-overview)
2. [Logo & Icon](#logo--icon)
3. [Color Palette](#color-palette)
4. [Typography](#typography)
5. [Splash Screen](#splash-screen)
6. [App Store Assets](#app-store-assets)
7. [Usage Guidelines](#usage-guidelines)

---

## App Overview

### About BATEU, CURTIU
BATEU, CURTIU is a social connection app that brings people together through shared experiences. The name combines "Bateu" (Portuguese for "beat" or "struck") with "Curtiu" (Portuguese for "liked/enjoyed"), representing the heartbeat of social interaction.

### App Concept
- **Connection** - Bringing people together
- **Sharing** - Expressing and sharing experiences
- **Discovery** - Finding new connections and content

---

## Logo & Icon

### Primary App Icon

**File:** `app-icons/bateu-curtiu-app-icon.svg`

The app icon features:
- Dark gradient background (#0a0a0a → #111111)
- Gold gradient ring (#c9a962 → #e5d4a1 → #c9a962)
- "BATEU" text at top
- "CURTIU" text at bottom
- Heart symbol in center
- Decorative accent dots

### Icon Specifications
- **Format:** SVG (scalable)
- **Base Size:** 1024x1024px
- **Safe Zone:** 10% margin from edges
- **Corner Radius:** None (circular design)

### Icon Variations

| Variation | File | Use Case |
|-----------|------|----------|
| App Icon | `bateu-curtiu-app-icon.svg` | Main app icon |
| Splash Screen | `bateu-curtiu-splash.svg` | App launch screen |
| Play Store | `bateu-curtiu-playstore.svg` | Google Play listing |
| App Store | `bateu-curtiu-appstore.svg` | Apple App Store listing |

---

## Color Palette

### Primary Colors

| Color | Hex | RGB | Usage |
|-------|-----|-----|-------|
| Gold | `#c9a962` | 201, 169, 98 | Primary brand color, accents |
| Light Gold | `#e5d4a1` | 229, 212, 161 | Highlights, gradients |

### Background Colors

| Color | Hex | RGB | Usage |
|-------|-----|-----|-------|
| Dark | `#0a0a0a` | 10, 10, 10 | Primary background |
| Surface | `#111111` | 17, 17, 17 | Cards, modals |
| Card | `#141414` | 20, 20, 20 | Elevated surfaces |

### Text Colors

| Color | Hex | RGB | Usage |
|-------|-----|-----|-------|
| Primary Text | `#f5f5f5` | 245, 245, 245 | Headings, body text |
| Secondary Text | `#a0a0a0` | 160, 160, 160 | Subtitle text |

### Gradients

**Gold Gradient (Primary)**
```
#c9a962 → #e5d4a1 → #c9a962
```

**Background Gradient**
```
#0a0a0a → #1a1a1a
```

---

## Typography

### Primary Font: Playfair Display

Used for headings and branding elements.

**Weights:** 700 (Bold)

**Usage:**
- App icon text
- Splash screen content
- Marketing materials

### Secondary Font: Inter

Used for body text and UI elements.

**Weights:** 400, 500, 600, 700

**Usage:**
- App UI
- Button labels
- Form inputs
- Menu items

### Typography Scale (App)

| Level | Size | Weight | Usage |
|-------|------|--------|-------|
| Display | 32px | 700 | Splash screen hero |
| H1 | 28px | 700 | Screen titles |
| H2 | 24px | 600 | Section headers |
| H3 | 20px | 600 | Card titles |
| Body | 16px | 400 | Body text |
| Caption | 12px | 400 | Microcopy |

---

## Splash Screen

### Design Elements

**File:** `app-icons/bateu-curtiu-splash.svg`

The splash screen includes:
- Full-screen dark gradient background
- Central app logo (scaled down)
- Animated loading dots
- Tagline: "CONNECT • SHARE • DISCOVER"

### Animation
The loading dots pulse with opacity animation:
- Duration: 1.5 seconds
- Stagger: 0.2 seconds per dot
- Pattern: 0.3 → 1.0 → 0.3 opacity

### Display Time
- Recommended: 2-3 seconds
- Maximum: Until app is ready (don't delay)

---

## App Store Assets

### Google Play Store

**File:** `app-icons/bateu-curtiu-playstore.svg`

**Specifications:**
- Size: 180x180px
- Rounded corners: 40px
- Simplified design for small sizes
- Optimized for Play Store display

**Feature Graphic Requirements:**
- Size: 1024x500px
- Format: PNG or JPG
- Keep text within safe zone

### Apple App Store

**File:** `app-icons/bateu-curtiu-appstore.svg`

**Specifications:**
- Size: 1024x1024px
- Rounded corners: 220px (iOS standard)
- Includes Apple-style subtle inner shadow
- Optimized for iOS visual standards

**App Store Screenshots:**
| Device | Size | Quantity |
|--------|------|----------|
| iPhone | 6.5" (1284x2778) | 3-10 |
| iPad | 12.9" (2048x2732) | 3-10 |

---

## Usage Guidelines

### DO ✅
- Use official SVG files for all implementations
- Maintain color accuracy
- Scale proportionally
- Use approved variations
- Follow clear space requirements

### DON'T ❌
- Modify the logo elements
- Add effects or filters
- Change colors
- Rotate or distort
- Place on busy backgrounds
- Use below minimum sizes

### Minimum Sizes

| Context | Size |
|---------|------|
| App Icon | 1024px (source) → 180px (display) |
| Favicon | 32px |
| UI Button | 44x44px touch target |

### Clear Space
Maintain 10% margin around the icon on all sides.

---

## Social Media for App

### Profile Images
- Use app icon at minimum 100px

### Banner Sizes

| Platform | Size |
|----------|------|
| Twitter/X | 1500x500px |
| Instagram | 1080x1080px |
| Facebook | 820x312px |
| LinkedIn | 1128x191px |

### App Launch Graphics
- Promo graphics: 2048x2732px (iPad size)
- Email header: 600x200px
- Website hero: 1920x1080px

---

## Color Implementation

### CSS Variables (App)

```css
:root {
  --color-gold: #c9a962;
  --color-gold-light: #e5d4a1;
  --color-background-dark: #0a0a0a;
  --color-background-surface: #111111;
  --color-text-primary: #f5f5f5;
  --color-text-secondary: #a0a0a0;
  
  --gradient-gold: linear-gradient(
    135deg,
    #c9a962 0%,
    #e5d4a1 50%,
    #c9a962 100%
  );
}
```

### Swift/iOS Colors

```swift
extension UIColor {
    static let gold = UIColor(hex: "#c9a962")
    static let goldLight = UIColor(hex: "#e5d4a1")
    static let backgroundDark = UIColor(hex: "#0a0a0a")
    static let backgroundSurface = UIColor(hex: "#111111")
    static let textPrimary = UIColor(hex: "#f5f5f5")
}
```

### Android Colors

```xml
<resources>
    <color name="gold">#c9a962</color>
    <color name="gold_light">#e5d4a1</color>
    <color name="background_dark">#0a0a0a</color>
    <color name="background_surface">#111111</color>
    <color name="text_primary">#f5f5f5</color>
</resources>
```

---

## File Formats

### Recommended

| Use | Format | Notes |
|-----|--------|-------|
| App Icon | SVG, PNG (@2x, @3x) | Source in SVG |
| Splash | SVG, PNG | Animated variant possible |
| Store Listings | PNG, JPG | Follow platform specs |
| Marketing | PDF, AI, EPS | Vector for print |

---

## Contact

For brand inquiries:
- Email: [brand@famalab.com]
- Assets: [internal-link]

---

*BATEU, CURTIU Brand Guidelines v1.0 | Last Updated: 2024*
*Part of FAMA.LAB Design System*

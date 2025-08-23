# 🚗 AutoZone Garage Theme

## Overview
The AutoZone website has been transformed with a new **garage-themed design** featuring a bold red/white/black color scheme that reflects the industrial, automotive nature of the business.

## 🎨 Color Palette

### Primary Colors
- **Red**: `#FF0000` - Main brand color, used for buttons, accents, and highlights
- **Black**: `#000000` - Secondary color for headers, footers, and dark elements
- **White**: `#FFFFFF` - Background and text color for contrast

### Supporting Colors
- **Gray Scale**: Various shades from `#F9FAFB` to `#111827` for text and backgrounds
- **Red Variants**: `#FF3333`, `#FF6600` for different emphasis levels
- **Success/Error**: `#00CC00` (green) and `#FF0000` (red) for status indicators

## 🏭 Design Elements

### Typography
- **Primary Font**: Inter (clean, modern, industrial feel)
- **Monospace**: JetBrains Mono for technical elements
- **Font Weights**: 300-900 for various emphasis levels

### Visual Patterns
- **Garage Pattern**: Subtle red dots pattern for backgrounds
- **Industrial Grid**: Angular geometric pattern for industrial sections
- **Red Glow**: Animated glow effects for interactive elements

### Shadows & Effects
- **Garage Shadow**: Red-tinted shadows for cards and buttons
- **Industrial Shadow**: Heavy, professional shadows for industrial elements
- **Red Glow Animation**: Pulsing red glow for attention-grabbing elements

## 🧩 CSS Classes

### Background Classes
```css
.garage-bg          /* Black background with white text */
.garage-pattern     /* Red dots pattern background */
.industrial-pattern /* Angular grid pattern background */
```

### Card Classes
```css
.garage-card        /* White card with red border and garage shadow */
.industrial-card    /* Dark card with industrial styling */
```

### Button Classes
```css
.garage-button      /* Red button with hover effects */
.garage-button-outline /* Red outline button */
.industrial-button  /* Dark industrial button */
```

### Text Classes
```css
.garage-text        /* Red text with bold weight */
.garage-accent      /* Red background with dark text */
```

### Animation Classes
```css
.animate-garage-pulse /* Gentle pulsing animation */
.animate-red-glow     /* Red glow animation */
```

## 🎯 Usage Examples

### Hero Section
```tsx
<section className="hero-gradient text-white py-20">
  <h1 className="text-6xl font-bold mb-6 animate-garage-pulse">
    🚗 AutoZone Garage
  </h1>
  <button className="garage-button animate-red-glow">
    Shop Parts
  </button>
</section>
```

### Feature Cards
```tsx
<div className="garage-card p-8 text-center hover:scale-105 transition-transform duration-300">
  <h3 className="text-xl font-bold mb-4 text-gray-900">Expert Mechanics</h3>
  <p className="text-gray-600">Certified technicians with years of experience</p>
</div>
```

### Industrial Section
```tsx
<section className="py-20 bg-gray-900 text-white industrial-pattern">
  <div className="industrial-card p-8">
    <h3 className="text-2xl font-bold mb-4 text-red-400">Commercial Fleet</h3>
    <p>Complete fleet maintenance and repair services</p>
  </div>
</section>
```

## 🔧 Customization

### Adding New Colors
Add to `tailwind.config.js`:
```js
garage: {
  DEFAULT: "#1A1A1A",
  light: "#2A2A2A",
  dark: "#0A0A0A",
  accent: "#FF3333",
  // ... more variants
}
```

### Adding New Patterns
Add to `tailwind.config.js`:
```js
backgroundImage: {
  'new-pattern': "url('data:image/svg+xml,...')",
}
```

### Adding New Animations
Add to `tailwind.config.js`:
```js
keyframes: {
  "new-animation": {
    "0%": { transform: "scale(1)" },
    "100%": { transform: "scale(1.1)" },
  },
},
animation: {
  "animate-new": "new-animation 1s ease-in-out infinite",
}
```

## 🚀 Benefits

1. **Professional Appearance**: Industrial styling conveys expertise and reliability
2. **Brand Recognition**: Bold red color makes the brand memorable
3. **User Experience**: Clear visual hierarchy and intuitive navigation
4. **Accessibility**: High contrast colors improve readability
5. **Mobile Friendly**: Responsive design works on all devices

## 🎨 Theme Inspiration

The garage theme draws inspiration from:
- **Automotive Industry**: Professional, technical, reliable
- **Industrial Design**: Clean lines, bold colors, functional aesthetics
- **Modern Web Design**: Smooth animations, responsive layouts, accessibility
- **Brand Identity**: AutoZone's commitment to quality automotive solutions

---

*This theme transforms the AutoZone website into a professional, garage-like experience that reflects the quality and expertise of automotive professionals.*

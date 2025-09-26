# 📱 Responsive Design System Guide

## 🎯 Overview
Hệ thống responsive design toàn diện cho FTC Website, đảm bảo hiển thị tối ưu trên mọi thiết bị.

## 🚀 Features

### ✅ Responsive Utilities
- **Fluid Typography**: Sử dụng `clamp()` để text tự động điều chỉnh
- **Flexible Spacing**: Padding/margin responsive theo viewport
- **Adaptive Grids**: Grid system tự động điều chỉnh số cột
- **Touch-Friendly**: Tất cả interactive elements có min-height 44px
- **Mobile-First**: Thiết kế ưu tiên mobile trước

### ✅ Breakpoints
```css
xs: 0px      (Mobile)
sm: 640px    (Large Mobile)
md: 768px    (Tablet)
lg: 1024px   (Desktop)
xl: 1280px   (Large Desktop)
2xl: 1536px  (Ultra-wide)
```

## 🛠️ Usage

### 1. CSS Classes

#### Typography
```css
.responsive-text        /* Fluid text size */
.responsive-heading     /* Fluid heading size */
.responsive-text-xs     /* Extra small text */
.responsive-text-sm     /* Small text */
.responsive-text-base   /* Base text */
.responsive-text-lg     /* Large text */
.responsive-text-xl     /* Extra large text */
.responsive-text-2xl    /* 2X large text */
.responsive-text-3xl    /* 3X large text */
.responsive-text-4xl    /* 4X large text */
.responsive-text-5xl    /* 5X large text */
.responsive-text-6xl    /* 6X large text */
```

#### Layout
```css
.responsive-container   /* Responsive container */
.responsive-grid        /* Auto-fit grid */
.responsive-grid-2      /* 2-column responsive grid */
.responsive-grid-3      /* 3-column responsive grid */
.responsive-flex        /* Responsive flexbox */
.responsive-flex-col    /* Responsive flex column */
.responsive-flex-center /* Centered flex */
```

#### Components
```css
.responsive-button      /* Responsive button */
.responsive-button-sm   /* Small button */
.responsive-button-lg   /* Large button */
.responsive-card        /* Responsive card */
.responsive-input       /* Responsive input */
.responsive-textarea    /* Responsive textarea */
.responsive-icon        /* Responsive icon */
.responsive-icon-sm     /* Small icon */
.responsive-icon-lg     /* Large icon */
.responsive-avatar      /* Responsive avatar */
.responsive-image       /* Responsive image */
```

#### Spacing
```css
.responsive-p-0 to .responsive-p-6  /* Responsive padding */
.responsive-m-0 to .responsive-m-6  /* Responsive margin */
.responsive-padding                  /* Fluid padding */
.responsive-margin                   /* Fluid margin */
.responsive-gap                      /* Fluid gap */
```

### 2. React Components

#### ResponsiveContainer
```tsx
import { ResponsiveContainer } from '@/components/ui/responsive'

<ResponsiveContainer maxWidth="lg" className="custom-class">
  <h1>Content</h1>
</ResponsiveContainer>
```

#### ResponsiveText
```tsx
import { ResponsiveText } from '@/components/ui/responsive'

<ResponsiveText size="lg" weight="bold" color="white">
  Responsive text content
</ResponsiveText>
```

#### ResponsiveHeading
```tsx
import { ResponsiveHeading } from '@/components/ui/responsive'

<ResponsiveHeading level={1} size="2xl">
  Page Title
</ResponsiveHeading>
```

#### ResponsiveButton
```tsx
import { ResponsiveButton } from '@/components/ui/responsive'

<ResponsiveButton variant="primary" size="lg" onClick={handleClick}>
  Click Me
</ResponsiveButton>
```

#### ResponsiveCard
```tsx
import { ResponsiveCard } from '@/components/ui/responsive'

<ResponsiveCard hover padding="lg">
  <h3>Card Title</h3>
  <p>Card content</p>
</ResponsiveCard>
```

#### ResponsiveGrid
```tsx
import { ResponsiveGrid } from '@/components/ui/responsive'

<ResponsiveGrid cols={3} gap="md">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</ResponsiveGrid>
```

#### ResponsiveFlex
```tsx
import { ResponsiveFlex } from '@/components/ui/responsive'

<ResponsiveFlex direction="row" align="center" justify="between" wrap>
  <div>Left content</div>
  <div>Right content</div>
</ResponsiveFlex>
```

### 3. Responsive Hook

```tsx
import { useResponsive } from '@/hooks/useResponsive'

function MyComponent() {
  const { isMobile, isTablet, isDesktop, currentBreakpoint } = useResponsive()
  
  return (
    <div>
      {isMobile && <MobileView />}
      {isTablet && <TabletView />}
      {isDesktop && <DesktopView />}
    </div>
  )
}
```

## 📱 Mobile Optimizations

### Touch Targets
- Tất cả buttons có min-height: 44px
- Tất cả interactive elements có min-width: 44px
- Spacing tối thiểu 8px giữa các touch targets

### Typography
- Font size tối thiểu 16px trên mobile
- Line height tối thiểu 1.5
- Word wrapping và hyphenation tự động

### Layout
- Single column layout trên mobile
- Horizontal scrolling cho navigation
- Collapsible sections
- Sticky headers

## 🎨 Best Practices

### 1. Mobile-First Approach
```css
/* Start with mobile styles */
.component {
  font-size: 1rem;
  padding: 1rem;
}

/* Then add larger screen styles */
@media (min-width: 768px) {
  .component {
    font-size: 1.125rem;
    padding: 1.5rem;
  }
}
```

### 2. Use clamp() for Fluid Typography
```css
.responsive-heading {
  font-size: clamp(1.5rem, 5vw, 3rem);
}
```

### 3. Flexible Grids
```css
.responsive-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: clamp(1rem, 3vw, 2rem);
}
```

### 4. Responsive Images
```css
.responsive-image {
  width: 100%;
  height: auto;
  max-width: 100%;
  object-fit: cover;
}
```

## 🔧 Customization

### Adding New Breakpoints
```css
@media (min-width: 1920px) {
  .responsive-container {
    max-width: 1600px;
  }
}
```

### Custom Responsive Classes
```css
.my-responsive-class {
  font-size: clamp(0.875rem, 2.5vw, 1.25rem);
  padding: clamp(0.5rem, 2vw, 1.5rem);
}
```

## 🐛 Troubleshooting

### Common Issues

1. **Text too small on mobile**
   - Use `responsive-text` class
   - Check font-size minimums

2. **Touch targets too small**
   - Ensure min-height: 44px
   - Add adequate padding

3. **Layout breaks on tablet**
   - Check grid minmax values
   - Test with different screen sizes

4. **Images not responsive**
   - Use `responsive-image` class
   - Set max-width: 100%

## 📊 Performance

### Optimizations
- CSS `clamp()` reduces layout shifts
- `object-fit: cover` prevents image distortion
- `flex-wrap` prevents overflow
- `word-wrap: break-word` prevents text overflow

### Testing
- Test on real devices
- Use browser dev tools
- Check different orientations
- Validate with accessibility tools

## 🎯 Examples

### Complete Responsive Page
```tsx
import { 
  ResponsiveContainer, 
  ResponsiveHeading, 
  ResponsiveText, 
  ResponsiveGrid, 
  ResponsiveCard 
} from '@/components/ui/responsive'

export function ResponsivePage() {
  return (
    <ResponsiveContainer>
      <ResponsiveHeading level={1} size="4xl">
        Page Title
      </ResponsiveHeading>
      
      <ResponsiveText size="lg" className="mb-8">
        Responsive description text
      </ResponsiveText>
      
      <ResponsiveGrid cols={3} gap="lg">
        <ResponsiveCard hover>
          <h3>Card 1</h3>
          <p>Content</p>
        </ResponsiveCard>
        <ResponsiveCard hover>
          <h3>Card 2</h3>
          <p>Content</p>
        </ResponsiveCard>
        <ResponsiveCard hover>
          <h3>Card 3</h3>
          <p>Content</p>
        </ResponsiveCard>
      </ResponsiveGrid>
    </ResponsiveContainer>
  )
}
```

---

**💡 Tip**: Luôn test trên nhiều thiết bị khác nhau để đảm bảo trải nghiệm tốt nhất!

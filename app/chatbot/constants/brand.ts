/**
 * FTC Dark Theme Color System
 * Modern dark color palette based on #003663 (Navy Blue) with sophisticated dark backgrounds
 */

export const BRAND = {
  // Primary Colors - Dark Theme
  primary: "#4A9FFF",        // Bright Navy Blue (lightened for dark bg)
  secondary: "#003663",      // Deep Navy (original)
  tertiary: "#0A1B2E",      // Very dark navy for backgrounds
  
  // Dark Theme Color Scale (Inverted and optimized for dark backgrounds)
  primary50: "#0A1B2E",      // Darkest background
  primary100: "#0F2138",     // Very dark background 
  primary200: "#152742",     // Dark background
  primary300: "#1A2D4C",     // Medium dark background
  primary400: "#1F3356",     // Medium background
  primary500: "#003663",     // Original primary (medium accent)
  primary600: "#1A5490",     // Brighter accent
  primary700: "#2D6BB3",     // Bright accent
  primary800: "#4A9FFF",     // Very bright accent (main interactive)
  primary900: "#7FB8FF",     // Brightest accent (highlights)
  
  // Dark Theme Complementary Colors
  accent: "#4A9FFF",         // Main interactive color
  accentLight: "#7FB8FF",    // Light interactive color
  accentDark: "#1A5490",     // Dark interactive color
  warm: "#FF9F40",          // Warm orange for highlights
  warmLight: "#FFB366",     // Light warm orange
  warmDark: "#E6851A",      // Dark warm orange
  
  // Dark Theme Gradients - Sophisticated & Modern
  gradients: {
    primary: "bg-gradient-to-r from-[#1A5490] to-[#4A9FFF]",
    primaryReverse: "bg-gradient-to-r from-[#4A9FFF] to-[#1A5490]",
    radial: "bg-gradient-to-br from-[#003663] via-[#1A5490] to-[#4A9FFF]",
    dark: "bg-gradient-to-br from-[#0A1B2E] via-[#0F2138] to-[#152742]",
    darkRadial: "bg-gradient-to-br from-[#0A1B2E] via-[#003663] to-[#152742]",
    soft: "bg-gradient-to-br from-[#003663]/20 via-[#1A5490]/10 to-[#4A9FFF]/20",
    text: "bg-gradient-to-r from-[#4A9FFF] via-[#7FB8FF] to-[#4A9FFF] bg-clip-text text-transparent",
    glow: "bg-gradient-to-r from-[#4A9FFF]/30 via-[#1A5490]/20 to-[#003663]/30",
    glass: "bg-gradient-to-br from-[#4A9FFF]/10 via-[#003663]/5 to-[#0A1B2E]/20",
    surface: "bg-gradient-to-br from-[#0F2138] via-[#152742] to-[#1A2D4C]",
    ethereal: "bg-gradient-to-br from-[#4A9FFF]/5 via-transparent to-[#003663]/10",
    ambient: "bg-gradient-to-r from-[#003663]/15 via-[#1A5490]/8 to-[#4A9FFF]/15"
  },
  
  // Dark Theme Surfaces & Backgrounds
  surfaces: {
    primary: "bg-[#0A1B2E]",                    // Main dark background
    secondary: "bg-gradient-to-br from-[#0F2138] to-[#152742]",  // Secondary dark gradient
    glass: "bg-[#0A1B2E]/80 backdrop-blur-xl",  // Dark glass effect
    lightGlass: "bg-[#4A9FFF]/10 backdrop-blur-xl",  // Light glass with primary color
    card: "bg-[#0F2138]/95 backdrop-blur-sm",   // Card backgrounds
    panel: "bg-gradient-to-br from-[#0F2138] via-[#152742] to-[#1A2D4C]", // Panel gradient
    hover: "hover:bg-[#152742]/70",             // Hover states
    interactive: "bg-gradient-to-br from-[#152742]/90 to-[#1A2D4C]/90 backdrop-blur-sm",
    chatBubble: "bg-[#152742]/80",              // Chat bubble background
    userBubble: "bg-gradient-to-r from-[#1A5490] to-[#4A9FFF]" // User message background
  },
  
  // Dark Theme Borders & Outlines
  borders: {
    light: "border-[#152742]/60",              // Light border in dark theme
    medium: "border-[#1A2D4C]/80",             // Medium border
    primary: "border-[#4A9FFF]/30",            // Primary color border
    glass: "border-[#4A9FFF]/20",              // Glass effect border
    glow: "border-[#4A9FFF]/40 shadow-[0_0_20px_rgba(74,159,255,0.25)]", // Glowing border
    accent: "border-[#1A5490]/50",             // Accent border
    subtle: "border-[#0F2138]/80"              // Very subtle border
  },
  
  // Dark Theme Text Colors
  text: {
    primary: "text-white",                     // Main text in dark theme
    secondary: "text-gray-300",               // Secondary text
    muted: "text-gray-500",                   // Muted text
    light: "text-gray-400",                   // Light text
    accent: "text-[#4A9FFF]",                 // Accent text
    accentLight: "text-[#7FB8FF]",            // Light accent text
    warm: "text-[#FF9F40]",                   // Warm text
    gradient: "bg-gradient-to-r from-[#4A9FFF] via-[#7FB8FF] to-[#4A9FFF] bg-clip-text text-transparent", // Gradient text
    white: "text-white",                      // Pure white
    whiteAlpha: "text-white/90",              // Transparent white
    inverse: "text-[#0A1B2E]",               // Dark text (for light backgrounds)
    placeholder: "text-gray-600"             // Placeholder text
  },
  
  // Dark Theme Shadows & Effects
  shadows: {
    soft: "shadow-sm shadow-black/20",
    medium: "shadow-md shadow-black/30",
    large: "shadow-lg shadow-black/40",
    xl: "shadow-xl shadow-black/50",
    glow: "shadow-2xl shadow-[#4A9FFF]/25",     // Blue glow for dark theme
    glowWarm: "shadow-2xl shadow-[#FF9F40]/20", // Warm glow
    inner: "shadow-inner shadow-black/20",
    ambient: "shadow-2xl shadow-[#4A9FFF]/15",
    neon: "shadow-[0_0_30px_rgba(74,159,255,0.5)]" // Neon effect
  },
  
  // Dark Theme Interactive States
  states: {
    hover: "hover:shadow-lg hover:shadow-[#4A9FFF]/20 hover:scale-[1.02]", // Blue glow on hover
    hoverWarm: "hover:shadow-lg hover:shadow-[#FF9F40]/20 hover:scale-[1.02]", // Warm glow on hover
    active: "active:scale-[0.98]",
    focus: "focus:ring-2 focus:ring-[#4A9FFF]/30 focus:border-[#4A9FFF]", // Blue focus ring
    disabled: "disabled:opacity-50 disabled:cursor-not-allowed",
    selected: "bg-[#4A9FFF]/20 border-[#4A9FFF]/40", // Selected state
    loading: "animate-pulse opacity-70" // Loading state
  }
} as const

/**
 * Dark Theme Color Usage Guidelines:
 * - Primary (#4A9FFF): CTA buttons, links, headings, focus states, interactive elements
 * - Secondary (#003663): Accent backgrounds, moderate emphasis, branding elements
 * - Tertiary (#0A1B2E): Main backgrounds, containers, dark surfaces
 * - Text: White and light grays for readability on dark backgrounds
 * - Gradients: Sophisticated effects with blue tones, glassmorphism, ambient lighting
 * - Surfaces: Dark backgrounds with subtle transparency and blue accent lighting
 * - Interactive: Blue glows, neon effects, smooth transitions for modern feel
 */

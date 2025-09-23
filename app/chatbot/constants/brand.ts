/**
 * FTC Brand Color System
 * Modern color palette based on #003663 (Navy Blue) and #0e1117 (Dark Blue-Black)
 */

export const BRAND = {
  // Primary Colors
  primary: "#003663",        // Deep Navy
  secondary: "#0e1117",      // Dark Blue-Black
  
  // Tonal Variations
  primary50: "#f0f4f8",      // Very light blue
  primary100: "#d1e0eb",     // Light blue
  primary200: "#a3c2d6",    // Medium light blue
  primary300: "#7498b3",    // Medium blue
  primary400: "#456a8a",    // Medium dark blue
  primary500: "#003663",    // Main primary
  primary600: "#002a4f",    // Darker primary
  primary700: "#001f3b",    // Very dark primary
  primary800: "#001426",    // Extremely dark
  primary900: "#0e1117",    // Secondary (darkest)
  
  // Accent & Complementary
  accent: "#1a5490",         // Bright navy
  accentLight: "#2563eb",    // Lighter accent
  warm: "#f59e0b",          // Golden yellow for highlights
  warmLight: "#fbbf24",     // Light warm
  
  // Gradients - Modern & Sophisticated
  gradients: {
    primary: "bg-gradient-to-r from-[#003663] to-[#0e1117]",
    primaryReverse: "bg-gradient-to-r from-[#0e1117] to-[#003663]",
    radial: "bg-gradient-to-br from-[#003663] via-[#1a5490] to-[#0e1117]",
    soft: "bg-gradient-to-br from-[#003663]/10 via-[#1a5490]/5 to-[#0e1117]/10",
    text: "bg-gradient-to-r from-[#003663] via-[#1a5490] to-[#0e1117] bg-clip-text text-transparent",
    glow: "bg-gradient-to-r from-[#003663]/20 via-[#1a5490]/30 to-[#0e1117]/20",
    glass: "bg-gradient-to-br from-white/10 via-[#003663]/5 to-[#0e1117]/10",
    surface: "bg-gradient-to-br from-white via-[#f0f4f8] to-white",
    ethereal: "bg-gradient-to-br from-[#003663]/5 via-transparent to-[#0e1117]/5",
    ambient: "bg-gradient-to-r from-[#003663]/10 via-[#1a5490]/5 to-[#0e1117]/10"
  },
  
  // Surfaces & Backgrounds
  surfaces: {
    primary: "bg-white",
    secondary: "bg-gradient-to-br from-[#f0f4f8] to-white",
    glass: "bg-white/80 backdrop-blur-xl",
    darkGlass: "bg-[#0e1117]/90 backdrop-blur-xl",
    card: "bg-white/95 backdrop-blur-sm",
    panel: "bg-gradient-to-br from-[#003663]/5 via-white to-[#0e1117]/5",
    hover: "hover:bg-gradient-to-br hover:from-[#003663]/10 hover:to-[#0e1117]/10",
    interactive: "bg-gradient-to-br from-white/90 to-[#f0f4f8]/90 backdrop-blur-sm"
  },
  
  // Borders & Outlines
  borders: {
    light: "border-gray-100",
    medium: "border-gray-200",
    primary: "border-[#003663]/20",
    glass: "border-white/20",
    glow: "border-[#003663]/30 shadow-[0_0_20px_rgba(0,54,99,0.15)]",
    accent: "border-[#1a5490]/30"
  },
  
  // Text Colors
  text: {
    primary: "text-[#0e1117]",
    secondary: "text-[#003663]",
    muted: "text-gray-600",
    light: "text-gray-500",
    gradient: "bg-gradient-to-r from-[#003663] via-[#1a5490] to-[#0e1117] bg-clip-text text-transparent",
    white: "text-white",
    whiteAlpha: "text-white/90"
  },
  
  // Shadows & Effects
  shadows: {
    soft: "shadow-sm",
    medium: "shadow-md",
    large: "shadow-lg shadow-[#003663]/10",
    xl: "shadow-xl shadow-[#003663]/15",
    glow: "shadow-2xl shadow-[#003663]/25",
    inner: "shadow-inner shadow-[#0e1117]/10",
    ambient: "shadow-2xl shadow-[#003663]/20"
  },
  
  // Interactive States
  states: {
    hover: "hover:shadow-lg hover:shadow-[#003663]/20 hover:scale-[1.02]",
    active: "active:scale-[0.98]",
    focus: "focus:ring-2 focus:ring-[#003663]/30 focus:border-[#003663]",
    disabled: "disabled:opacity-50 disabled:cursor-not-allowed"
  }
} as const

/**
 * Color usage guidelines:
 * - Primary (#003663): CTA buttons, links, headings, focus states
 * - Secondary (#0e1117): Text content, dark backgrounds, contrast elements
 * - Gradients: Premium effects, avatars, important elements
 * - Surfaces: Backgrounds, cards, panels with appropriate transparency
 */

import React from 'react'
import { cn } from '@/lib/utils'

// Responsive Container Component
interface ResponsiveContainerProps {
  children: React.ReactNode
  className?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
}

export function ResponsiveContainer({ 
  children, 
  className, 
  maxWidth = 'full' 
}: ResponsiveContainerProps) {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md', 
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full'
  }

  return (
    <div className={cn(
      'responsive-container',
      maxWidthClasses[maxWidth],
      className
    )}>
      {children}
    </div>
  )
}

// Responsive Text Component
interface ResponsiveTextProps {
  children: React.ReactNode
  className?: string
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl'
  weight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black'
  color?: 'white' | 'gray' | 'blue' | 'accent'
}

export function ResponsiveText({ 
  children, 
  className, 
  size = 'base',
  weight = 'normal',
  color = 'white'
}: ResponsiveTextProps) {
  const sizeClasses = {
    xs: 'responsive-text-xs',
    sm: 'responsive-text-sm',
    base: 'responsive-text-base',
    lg: 'responsive-text-lg',
    xl: 'responsive-text-xl',
    '2xl': 'responsive-text-2xl',
    '3xl': 'responsive-text-3xl',
    '4xl': 'responsive-text-4xl',
    '5xl': 'responsive-text-5xl',
    '6xl': 'responsive-text-6xl'
  }

  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
    extrabold: 'font-extrabold',
    black: 'font-black'
  }

  const colorClasses = {
    white: 'text-white',
    gray: 'text-gray-300',
    blue: 'text-blue-400',
    accent: 'text-accent'
  }

  return (
    <span className={cn(
      'responsive-text',
      sizeClasses[size],
      weightClasses[weight],
      colorClasses[color],
      className
    )}>
      {children}
    </span>
  )
}

// Responsive Heading Component
interface ResponsiveHeadingProps {
  children: React.ReactNode
  className?: string
  level?: 1 | 2 | 3 | 4 | 5 | 6
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl'
}

export function ResponsiveHeading({ 
  children, 
  className, 
  level = 1,
  size = 'xl'
}: ResponsiveHeadingProps) {
  const sizeClasses = {
    sm: 'responsive-text-lg',
    md: 'responsive-text-xl',
    lg: 'responsive-text-2xl',
    xl: 'responsive-text-3xl',
    '2xl': 'responsive-text-4xl',
    '3xl': 'responsive-text-5xl',
    '4xl': 'responsive-text-6xl',
    '5xl': 'responsive-text-6xl',
    '6xl': 'responsive-text-6xl'
  }

  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements

  return (
    <HeadingTag className={cn(
      'responsive-heading font-bold text-white',
      sizeClasses[size],
      className
    )}>
      {children}
    </HeadingTag>
  )
}

// Responsive Button Component
interface ResponsiveButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function ResponsiveButton({ 
  children, 
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: ResponsiveButtonProps) {
  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white shadow-lg hover:shadow-xl',
    outline: 'border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white',
    ghost: 'text-white hover:bg-white/10',
    destructive: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl'
  }

  const sizeClasses = {
    sm: 'responsive-button-sm',
    md: 'responsive-button',
    lg: 'responsive-button-lg'
  }

  return (
    <button
      className={cn(
        'responsive-button font-medium transition-all duration-300 hover:scale-105 active:scale-95',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

// Responsive Card Component
interface ResponsiveCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  padding?: 'sm' | 'md' | 'lg'
}

export function ResponsiveCard({ 
  children, 
  className, 
  hover = true,
  padding = 'md'
}: ResponsiveCardProps) {
  const paddingClasses = {
    sm: 'responsive-p-2',
    md: 'responsive-p-4',
    lg: 'responsive-p-6'
  }

  return (
    <div className={cn(
      'responsive-card bg-white/5 backdrop-blur-sm border border-white/10',
      paddingClasses[padding],
      hover && 'hover:bg-white/10 hover:border-white/20',
      className
    )}>
      {children}
    </div>
  )
}

// Responsive Grid Component
interface ResponsiveGridProps {
  children: React.ReactNode
  className?: string
  cols?: 1 | 2 | 3 | 4 | 5 | 6
  gap?: 'sm' | 'md' | 'lg'
}

export function ResponsiveGrid({ 
  children, 
  className, 
  cols = 3,
  gap = 'md'
}: ResponsiveGridProps) {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'responsive-grid-2',
    3: 'responsive-grid-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
    6: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6'
  }

  const gapClasses = {
    sm: 'gap-2',
    md: 'responsive-gap',
    lg: 'gap-6'
  }

  return (
    <div className={cn(
      'grid',
      gridClasses[cols],
      gapClasses[gap],
      className
    )}>
      {children}
    </div>
  )
}

// Responsive Flex Component
interface ResponsiveFlexProps {
  children: React.ReactNode
  className?: string
  direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse'
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
  wrap?: boolean
  gap?: 'sm' | 'md' | 'lg'
}

export function ResponsiveFlex({ 
  children, 
  className,
  direction = 'row',
  align = 'center',
  justify = 'start',
  wrap = true,
  gap = 'md'
}: ResponsiveFlexProps) {
  const directionClasses = {
    row: 'flex-row',
    col: 'flex-col',
    'row-reverse': 'flex-row-reverse',
    'col-reverse': 'flex-col-reverse'
  }

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
    baseline: 'items-baseline'
  }

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly'
  }

  const gapClasses = {
    sm: 'gap-2',
    md: 'responsive-gap',
    lg: 'gap-6'
  }

  return (
    <div className={cn(
      'flex',
      directionClasses[direction],
      alignClasses[align],
      justifyClasses[justify],
      wrap && 'flex-wrap',
      gapClasses[gap],
      className
    )}>
      {children}
    </div>
  )
}

// Responsive Input Component
interface ResponsiveInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
  error?: boolean
}

export function ResponsiveInput({ 
  className, 
  error = false,
  ...props
}: ResponsiveInputProps) {
  return (
    <input
      className={cn(
        'responsive-input',
        error && 'border-red-400 focus:border-red-400 focus:ring-red-400/20',
        className
      )}
      {...props}
    />
  )
}

// Responsive Textarea Component
interface ResponsiveTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string
  error?: boolean
}

export function ResponsiveTextarea({ 
  className, 
  error = false,
  ...props
}: ResponsiveTextareaProps) {
  return (
    <textarea
      className={cn(
        'responsive-textarea',
        error && 'border-red-400 focus:border-red-400 focus:ring-red-400/20',
        className
      )}
      {...props}
    />
  )
}

// Responsive Icon Component
interface ResponsiveIconProps {
  children: React.ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function ResponsiveIcon({ 
  children, 
  className, 
  size = 'md'
}: ResponsiveIconProps) {
  const sizeClasses = {
    sm: 'responsive-icon-sm',
    md: 'responsive-icon',
    lg: 'responsive-icon-lg'
  }

  return (
    <div className={cn(
      'flex items-center justify-center',
      sizeClasses[size],
      className
    )}>
      {children}
    </div>
  )
}

// Responsive Image Component
interface ResponsiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  className?: string
  aspectRatio?: 'square' | 'video' | 'wide' | 'auto'
}

export function ResponsiveImage({ 
  className, 
  aspectRatio = 'auto',
  ...props
}: ResponsiveImageProps) {
  const aspectClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    wide: 'aspect-[16/9]',
    auto: ''
  }

  return (
    <img
      className={cn(
        'responsive-image',
        aspectClasses[aspectRatio],
        className
      )}
      {...props}
    />
  )
}

// Responsive Avatar Component
interface ResponsiveAvatarProps {
  src?: string
  alt?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
  fallback?: string
}

export function ResponsiveAvatar({ 
  src, 
  alt = 'Avatar',
  className,
  size = 'md',
  fallback = '?'
}: ResponsiveAvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'responsive-avatar text-base',
    lg: 'w-16 h-16 text-lg'
  }

  return (
    <div className={cn(
      'responsive-avatar bg-gradient-to-br from-blue-400 to-blue-600 text-white font-semibold flex items-center justify-center',
      sizeClasses[size],
      className
    )}>
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover rounded-full" />
      ) : (
        <span>{fallback}</span>
      )}
    </div>
  )
}

// Responsive Modal Component
interface ResponsiveModalProps {
  children: React.ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  open: boolean
  onClose: () => void
}

export function ResponsiveModal({ 
  children, 
  className, 
  size = 'md',
  open,
  onClose
}: ResponsiveModalProps) {
  const sizeClasses = {
    sm: 'responsive-modal max-w-sm',
    md: 'responsive-modal',
    lg: 'responsive-modal-lg',
    xl: 'responsive-modal-lg max-w-6xl'
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className={cn(
        'bg-gradient-to-br from-white/10 to-white/5 border border-white/20 shadow-2xl',
        sizeClasses[size],
        className
      )}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {children}
      </div>
    </div>
  )
}

// Responsive Spacer Component
interface ResponsiveSpacerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  className?: string
}

export function ResponsiveSpacer({ 
  size = 'md',
  className
}: ResponsiveSpacerProps) {
  const sizeClasses = {
    xs: 'h-2',
    sm: 'h-4',
    md: 'h-8',
    lg: 'h-12',
    xl: 'h-16',
    '2xl': 'h-24'
  }

  return <div className={cn(sizeClasses[size], className)} />
}

// Responsive Divider Component
interface ResponsiveDividerProps {
  className?: string
  orientation?: 'horizontal' | 'vertical'
  thickness?: 'thin' | 'medium' | 'thick'
}

export function ResponsiveDivider({ 
  className,
  orientation = 'horizontal',
  thickness = 'thin'
}: ResponsiveDividerProps) {
  const thicknessClasses = {
    thin: 'border-t',
    medium: 'border-t-2',
    thick: 'border-t-4'
  }

  const orientationClasses = {
    horizontal: 'w-full',
    vertical: 'h-full border-t-0 border-l'
  }

  return (
    <div className={cn(
      'border-white/20',
      thicknessClasses[thickness],
      orientationClasses[orientation],
      className
    )} />
  )
}

/**
 * Utility functions for class name management
 */

/**
 * Combine class names conditionally (similar to clsx/classnames)
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes
    .filter(Boolean)
    .join(' ')
    .trim()
}

/**
 * Create responsive class names
 */
export function responsive(
  base: string,
  sm?: string,
  md?: string,
  lg?: string,
  xl?: string
): string {
  const classes = [base]
  
  if (sm) classes.push(`sm:${sm}`)
  if (md) classes.push(`md:${md}`)
  if (lg) classes.push(`lg:${lg}`)
  if (xl) classes.push(`xl:${xl}`)
  
  return classes.join(' ')
}

/**
 * Create variant class names
 */
export function variant(
  base: string,
  variants: Record<string, string>,
  selected: string
): string {
  return cn(base, variants[selected])
}

/**
 * Create state-based class names
 */
export function stateClasses(states: {
  base?: string
  hover?: string
  focus?: string
  active?: string
  disabled?: string
}): string {
  const { base = '', hover, focus, active, disabled } = states
  
  return cn(
    base,
    hover && `hover:${hover}`,
    focus && `focus:${focus}`,
    active && `active:${active}`,
    disabled && `disabled:${disabled}`
  )
}

/**
 * Create size variant classes
 */
export function sizeVariant(
  base: string,
  size: 'sm' | 'md' | 'lg' | 'xl',
  variants: Record<string, string>
): string {
  return cn(base, variants[size])
}

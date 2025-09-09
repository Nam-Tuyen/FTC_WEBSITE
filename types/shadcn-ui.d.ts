import type { ElementRef, ComponentPropsWithoutRef } from 'react'

declare module '@/components/ui/card' {
  export type CardProps = React.ComponentPropsWithoutRef<'div'>
  export type CardHeaderProps = React.ComponentPropsWithoutRef<'div'>
  export type CardTitleProps = React.ComponentPropsWithoutRef<'h3'>
  export type CardContentProps = React.ComponentPropsWithoutRef<'div'>

  export const Card: React.ForwardRefExoticComponent<CardProps>
  export const CardHeader: React.ForwardRefExoticComponent<CardHeaderProps>
  export const CardTitle: React.ForwardRefExoticComponent<CardTitleProps>
  export const CardContent: React.ForwardRefExoticComponent<CardContentProps>
}

declare module '@/components/ui/avatar' {
  export type AvatarProps = React.ComponentPropsWithoutRef<'span'>
  export type AvatarImageProps = React.ComponentPropsWithoutRef<'img'>
  export type AvatarFallbackProps = React.ComponentPropsWithoutRef<'span'>

  export const Avatar: React.ForwardRefExoticComponent<AvatarProps>
  export const AvatarImage: React.ForwardRefExoticComponent<AvatarImageProps>
  export const AvatarFallback: React.ForwardRefExoticComponent<AvatarFallbackProps>
}

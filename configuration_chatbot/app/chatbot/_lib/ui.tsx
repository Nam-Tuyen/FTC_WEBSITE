import { type ComponentPropsWithoutRef, type FC } from 'react'
import { Card as UICard, CardContent as UICardContent, CardHeader as UICardHeader, CardTitle as UICardTitle } from "@/components/ui/card"
import { Avatar as UIAvatar, AvatarFallback as UIAvatarFallback, AvatarImage as UIAvatarImage } from "@/components/ui/avatar"

export type Message = {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

export type ChatProps = {
  messages: Message[]
  isTyping?: boolean
  onSendMessage: (message: string) => void
}

export type CardProps = ComponentPropsWithoutRef<typeof UICard>
export type CardContentProps = ComponentPropsWithoutRef<typeof UICardContent>
export type CardHeaderProps = ComponentPropsWithoutRef<typeof UICardHeader>
export type CardTitleProps = ComponentPropsWithoutRef<typeof UICardTitle>

export type AvatarProps = ComponentPropsWithoutRef<typeof UIAvatar>
export type AvatarFallbackProps = ComponentPropsWithoutRef<typeof UIAvatarFallback>
export type AvatarImageProps = ComponentPropsWithoutRef<typeof UIAvatarImage>

export {
  UICard as Card,
  UICardContent as CardContent,
  UICardHeader as CardHeader,
  UICardTitle as CardTitle,
  UIAvatar as Avatar,
  UIAvatarFallback as AvatarFallback,
  UIAvatarImage as AvatarImage
}

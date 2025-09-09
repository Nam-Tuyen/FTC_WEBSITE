import { FC, ReactNode } from 'react'

declare module '@/components/ui/card' {
  export interface CardProps {
    children?: ReactNode;
    className?: string;
  }

  export interface CardHeaderProps {
    children?: ReactNode;
    className?: string;
  }

  export interface CardTitleProps {
    children?: ReactNode;
    className?: string;
  }

  export interface CardContentProps {
    children?: ReactNode;
    className?: string;
  }

  export const Card: FC<CardProps>;
  export const CardHeader: FC<CardHeaderProps>;
  export const CardTitle: FC<CardTitleProps>;
  export const CardContent: FC<CardContentProps>;
}

declare module '@/components/ui/avatar' {
  export interface AvatarProps {
    children?: ReactNode;
    className?: string;
  }

  export interface AvatarImageProps {
    src: string;
    alt: string;
    className?: string;
  }

  export interface AvatarFallbackProps {
    children?: ReactNode;
    className?: string;
  }

  export const Avatar: FC<AvatarProps>;
  export const AvatarImage: FC<AvatarImageProps>;
  export const AvatarFallback: FC<AvatarFallbackProps>;
}

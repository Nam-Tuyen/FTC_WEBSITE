import * as React from 'react';

declare module 'react' {
  export interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
    type: T;
    props: P;
    key: Key | null;
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      div: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
      span: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;
      p: React.DetailedHTMLProps<React.HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>;
      h1: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
      h2: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
      h3: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
      h4: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
      h5: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
      h6: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
      em: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      section: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      style: React.DetailedHTMLProps<React.StyleHTMLAttributes<HTMLStyleElement>, HTMLStyleElement>;
      [elemName: string]: any;
    }
  }
}

// UI Component types
declare module '@/components/ui/card' {
  export interface CardProps {
    children?: React.ReactNode;
    className?: string;
  }

  export interface CardHeaderProps {
    children?: React.ReactNode;
    className?: string;
  }

  export interface CardTitleProps {
    children?: React.ReactNode;
    className?: string;
  }

  export interface CardContentProps {
    children?: React.ReactNode;
    className?: string;
  }

  export const Card: React.FC<CardProps>;
  export const CardHeader: React.FC<CardHeaderProps>;
  export const CardTitle: React.FC<CardTitleProps>;
  export const CardContent: React.FC<CardContentProps>;
}

declare module '@/components/ui/avatar' {
  export interface AvatarProps {
    children?: React.ReactNode;
    className?: string;
  }

  export interface AvatarImageProps {
    src: string;
    alt: string;
    className?: string;
  }

  export interface AvatarFallbackProps {
    children?: React.ReactNode;
    className?: string;
  }

  export const Avatar: React.FC<AvatarProps>;
  export const AvatarImage: React.FC<AvatarImageProps>;
  export const AvatarFallback: React.FC<AvatarFallbackProps>;
}

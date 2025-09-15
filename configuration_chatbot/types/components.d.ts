import type { ElementType } from 'react'

declare module 'react' {
  interface JSX {
    IntrinsicElements: {
      [elemName: string]: any;
    }
  }
}

export {}

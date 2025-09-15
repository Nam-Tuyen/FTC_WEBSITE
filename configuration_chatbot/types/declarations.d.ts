declare module '*.css'
declare module '*.svg'
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.gif'
declare module '*.bmp'
declare module '*.tiff'

declare module '@/components/*' {
  const component: any
  export default component
}

declare module 'lucide-react' {
  const icons: any
  export const Menu: any
  export const X: any
  export const Zap: any
  export const Shield: any
  export const Cpu: any
  export const Info: any
}

declare module 'next/image' {
  const Image: any
  export default Image
}

declare module 'next/link' {
  const Link: any
  export default Link
}

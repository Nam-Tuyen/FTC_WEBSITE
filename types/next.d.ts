import { NextPage } from 'next'
import { AppProps } from 'next/app'
import { ReactElement, ReactNode } from 'react'

declare module 'next' {
  export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: ReactElement) => ReactNode
  }
}

declare module 'next/app' {
  export type AppPropsWithLayout<P = {}> = AppProps<P> & {
    Component: NextPageWithLayout
  }
}

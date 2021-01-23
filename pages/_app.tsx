import type { AppProps } from 'next/app'
import Head from 'next/head'
import Router from 'next/router'
import '@styles/index.css'
import { ThemeProvider } from 'next-themes'
import { ToastProvider } from 'react-toast-notifications'
import Toast from '@components/toast'
import NProgress from 'nprogress'
import '@styles/nprogress.css'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'ion-icon': { name: string }
    }
  }
}
NProgress.configure({ showSpinner: false })
Router.onRouteChangeStart = () => { NProgress.start() }
Router.onRouteChangeComplete = () => { NProgress.done() }
Router.onRouteChangeError = () => { NProgress.done() }

function App ({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <ThemeProvider defaultTheme='system' attribute='class'>
      <Head>
        <title>Parchment</title>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
        <script type='module' src='https://unpkg.com/ionicons@5.2.3/dist/ionicons/ionicons.esm.js' />
        <script noModule src='https://unpkg.com/ionicons@5.2.3/dist/ionicons/ionicons.js' />
      </Head>

      <ToastProvider autoDismiss components={{ Toast: Toast }} placement='bottom-right'>
        <Component {...pageProps} />
      </ToastProvider>
    </ThemeProvider>
  )
}

export default App

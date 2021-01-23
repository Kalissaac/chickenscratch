import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import '@styles/index.css'
import { ThemeProvider } from 'next-themes'
import { ToastProvider } from 'react-toast-notifications'
import Toast from '@components/toast'
import NProgress from 'nprogress'
import '@styles/nprogress.css'
import { useEffect } from 'react'

NProgress.configure({ showSpinner: false })

function App ({ Component, pageProps }: AppProps): JSX.Element {
  const router = useRouter()

  useEffect(() => {
    const startLoader = (): void => { NProgress.start() }
    const stopLoader = (): void => { NProgress.done() }

    router.events.on('routeChangeStart', startLoader)
    router.events.on('routeChangeComplete', stopLoader)
    router.events.on('routeChangeError', stopLoader)

    return () => {
      router.events.off('routeChangeStart', startLoader)
      router.events.off('routeChangeComplete', stopLoader)
      router.events.off('routeChangeError', stopLoader)
    }
  }, [])

  return (
    <ThemeProvider defaultTheme='system' attribute='class'>
      <Head>
        <title>Parchment</title>
        <meta name='viewport' content='initial-scale=1.0, width=device-width, height=device-height' />
      </Head>

      <ToastProvider autoDismiss components={{ Toast: Toast }} placement='bottom-right'>
        <Component {...pageProps} />
      </ToastProvider>
    </ThemeProvider>
  )
}

export default App

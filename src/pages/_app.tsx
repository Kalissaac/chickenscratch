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
import { SWRConfig } from 'swr'

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

  const fetcher = async (url: RequestInfo): Promise<any> => {
    const res = await fetch(url)
    const data = await res.json()
    // If the status code is not in the range 200-299,
    // we still try to parse and throw it.
    if (!res.ok) {
      const error = new Error(data)
      error.name = data.message ?? 'UNKNOWN_ERROR'
      throw error
    }

    return data
  }

  return (
    <ThemeProvider defaultTheme='system' attribute='class'>
      <Head>
        <title>Parchment</title>
        <meta name='viewport' content='initial-scale=1.0, width=device-width, height=device-height' />
        <link rel='icon' type='image/xml+svg' href='/favicon.svg' />
        {/* <link rel='apple-touch-icon' sizes='180x180' href='/apple-touch-icon.png' />
        <link rel='icon' type='image/png' sizes='32x32' href='/favicon-32x32.png' />
        <link rel='icon' type='image/png' sizes='16x16' href='/favicon-16x16.png' />
        <link rel='manifest' href='/site.webmanifest' /> */}
      </Head>

      <SWRConfig value={{ fetcher }}>
        <ToastProvider autoDismiss components={{ Toast: Toast }} placement='bottom-right'>
          <Component {...pageProps} />
        </ToastProvider>
      </SWRConfig>
    </ThemeProvider>
  )
}

export default App

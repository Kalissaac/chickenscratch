import type { AppProps } from 'next/app'
import Head from 'next/head'
import '@styles/index.css'
import { ThemeProvider } from 'next-themes'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'ion-icon': { name: string }
    }
  }
}

function App ({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <ThemeProvider defaultTheme='system' attribute='class'>
      <Head>
        <title>Parchment</title>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
        <script type='module' src='https://unpkg.com/ionicons@5.2.3/dist/ionicons/ionicons.esm.js' />
        <script noModule src='https://unpkg.com/ionicons@5.2.3/dist/ionicons/ionicons.js' />
      </Head>

      <Component {...pageProps} />

      <script src='https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.8.0/dist/alpine.min.js' defer />
    </ThemeProvider>
  )
}

export default App

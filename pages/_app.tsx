import type { AppProps } from 'next/app'
import Head from 'next/head'
import '@styles/index.css'
import { ThemeProvider } from 'next-themes'

function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider defaultTheme="system" attribute="class">
      <Head>
        <title>Parchment</title>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>

      <Component {...pageProps} />

      <script src="https://unpkg.com/ionicons@5.2.3/dist/ionicons.js"></script>
    </ThemeProvider>
  )
}

export default App

const fetch = require('node-fetch')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

module.exports = withBundleAnalyzer({
  poweredByHeader: false,
  reactStrictMode: true,
  async rewrites () {
    let isServerRunning = false

    try {
      const abortController = new AbortController()
      setTimeout(() => abortController.abort(), 500)

      const response = await fetch('http://localhost:3001', { signal: abortController.signal })
      isServerRunning = response.ok
    } catch {
      isServerRunning = false
    }

    return [
      {
        source: '/api/server',
        destination: isServerRunning ? 'http://localhost:3001' : process.env.API_DOMAIN
      }
    ]
  }
})

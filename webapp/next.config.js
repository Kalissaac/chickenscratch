const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

module.exports = withBundleAnalyzer({
  poweredByHeader: false,
  async redirects () {
    return [
      {
        source: '/',
        destination: '/home',
        permanent: true
      }
    ]
  }
})

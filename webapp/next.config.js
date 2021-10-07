const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

module.exports = withBundleAnalyzer({
  poweredByHeader: false,
  reactStrictMode: true,
  async redirects () {
    return [
      {
        source: '/',
        destination: '/home',
        permanent: true
      }
    ]
  },
  // Replace React with Preact in client production build
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      Object.assign(config.resolve.alias, {
        react: 'preact/compat',
        'react-dom/test-utils': 'preact/test-utils',
        'react-dom': 'preact/compat'
      })
    }

    return config
  }
})

module.exports = {
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
}

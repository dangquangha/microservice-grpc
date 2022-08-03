export default () => ({
  app: {
    baseUrlPrefix: '/api',
    docsBaseUrl: '/docs',
  },
  accessToken: {
    expiresIn: '8h',
    rememberMeIn: '365d',
    secret: 'superSecretKey',
  },
  refreshToken: {
    expiresIn: '1d',
  },
});

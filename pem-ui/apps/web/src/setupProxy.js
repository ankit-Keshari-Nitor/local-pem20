const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/pemws',
    createProxyMiddleware({
      target: 'https://10.15.102.181:29443/',
      pathRewrite: { '^/pemws': '/pemws' },
      changeOrigin: true,
      logLevel: 'debug',
      secure: false
    })
  );
  app.use(
    '/rest',
    createProxyMiddleware({
      target: 'https://10.15.101.101:29473/',
      pathRewrite: { '^/rest': '/rest' },
      changeOrigin: true,
      logLevel: 'debug',
      secure: false
    })
  );
  app.use(
    '/sponsors',
    createProxyMiddleware({
      target: 'http://10.15.106.209:9080/',
      pathRewrite: { '^/sponsors': '/sponsors' },
      changeOrigin: true,
      logLevel: 'debug',
      secure: false
    })
  );
};

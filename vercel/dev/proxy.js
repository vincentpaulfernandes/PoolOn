const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use('/api', createProxyMiddleware({
    target: 'https://7mvkx3am.api.sanity.io',
    changeOrigin: true,
  }));
};

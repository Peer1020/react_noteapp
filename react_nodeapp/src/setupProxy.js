const { ServerStyleSheets } = require('@material-ui/styles');
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: process.env.BACKEND_URL || `http://localhost:5000`,
            changeOrigin: true,
        })
    );
};
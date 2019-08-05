const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const path = require('path');
const { join } = require('path');

const port = parseInt(process.env.PORT, 10) || 8080;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    const rootStaticFiles = { // paths where files lies
      '/logo.png': 'static/images/logos',
      '/robots.txt': 'static',
      '/favicon.ico': 'static/images/icons',
      '/pdf.worker.js': '.next/static/chunks',
      '/service-worker.js': '.next',
      '/sitemap.xml': 'static'
    };
    if (rootStaticFiles[parsedUrl.pathname] || path.extname(parsedUrl.pathname) === '.xml'){
      const fileFolder = path.extname(parsedUrl.pathname) === '.xml' && !rootStaticFiles[parsedUrl.pathname]
        ? '.next'
        : rootStaticFiles[parsedUrl.pathname];
      const pathToFile = join(__dirname, fileFolder, parsedUrl.pathname);
      app.serveStatic(req, res, pathToFile);
    } else {
      handle(req, res, parsedUrl);
    }
  }).listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
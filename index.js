const http = require('node:http');
const path = require('node:path');
const fs = require('node:fs/promises');

const staticPath = path.join(__dirname, 'static');
const apiPath = path.join(__dirname, 'api');
const mimeTypes = {
  html: 'text/html',
  css: 'text/css',
  json: 'application/json'
};

const serveStatic = async ({ res, url }) => {
  const filePath = path.join(staticPath, url.pathname);
  const ext = path.extname(filePath).replace('.', '');
  try {
    const data = await fs.readFile(filePath);
    res.setHeader('Content-Type', mimeTypes[ext]);
    res.end(data);
  } catch (error) { /* empty */ }
};

const api = new Map();

const cacheFile = (name) => {
  const filePath = path.join(apiPath, name);
  try {
    const libPath = require.resolve(filePath);
    delete require.cache[libPath];
  } catch (error) { /* empty */ }
  const key = path.basename(filePath, '.js');
  try {
    const method = require(filePath);
    api.set(key, method);
  } catch (error) {
    api.delete(key);
  }
};

const cacheFolder = async (path) => {
  const files = await fs.readdir(path);
  files.forEach(cacheFile);
};


const serveApi = async ({ res, url }) => {
  const method = api.get(url.pathname.replace('/api/', ''));
  try {
    const result = await method(Object.fromEntries(url.searchParams));
    res.setHeader('Content-Type', mimeTypes['json']);
    res.end(JSON.stringify(result));
  } catch (error) { /* empty */ }
};

const hostname = 'localhost';
const port = 3000;

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url === '/' ? '/index.html' : req.url, `http://${hostname}:${port}`);
  const [first] = url.pathname.substring(1).split('/');
  if (first === 'api') {
    serveApi({ req, res, url });
  } else {
    serveStatic({ req, res, url });
  }
});

cacheFolder(apiPath);

server.listen(port, hostname, () => {
  console.log(`server has been started on port ${port}`);
});

import { createServer } from 'node:http';
import { renderCatalog } from './src/catalog.mjs';

// Node's own http module serves every page, no framework.
createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    res.end(renderCatalog());
    return;
  }
  res.writeHead(404).end();
}).listen(8080);

// Servidor local só para visualizar dist/ (npm run serve). Não é usado em produção.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const TIPOS = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.xml': 'application/xml', '.txt': 'text/plain' };
const porta = Number(process.env.PORT) || 4321;

createServer(async (req, res) => {
  let caminho = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let arquivo = path.join(DIST, caminho);
  if (!arquivo.startsWith(DIST)) return res.writeHead(403).end();
  try {
    if ((await stat(arquivo)).isDirectory()) arquivo = path.join(arquivo, 'index.html');
    res.writeHead(200, { 'content-type': TIPOS[path.extname(arquivo)] || 'application/octet-stream' });
    res.end(await readFile(arquivo));
  } catch {
    res.writeHead(404, { 'content-type': TIPOS['.html'] });
    res.end(await readFile(path.join(DIST, '404.html')).catch(() => 'Não encontrado'));
  }
}).listen(porta, () => console.log(`Atto em http://localhost:${porta}`));

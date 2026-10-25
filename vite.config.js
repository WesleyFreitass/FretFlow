import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'kanban-bridge-sync',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/api/kanban' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', () => {
              try {
                const targetDir = path.resolve(__dirname, 'src/data');
                if (!fs.existsSync(targetDir)) {
                  fs.mkdirSync(targetDir, { recursive: true });
                }
                const targetPath = path.resolve(targetDir, 'kanban_state.json');
                fs.writeFileSync(targetPath, body, 'utf8');
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true, timestamp: Date.now() }));
              } catch (err) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: err.message }));
              }
            });
            return;
          }
          if (req.url === '/api/kanban' && req.method === 'GET') {
            try {
              const targetPath = path.resolve(__dirname, 'src/data/kanban_state.json');
              if (fs.existsSync(targetPath)) {
                const data = fs.readFileSync(targetPath, 'utf8');
                res.setHeader('Content-Type', 'application/json');
                res.end(data);
                return;
              }
            } catch (_) {}
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify([]));
            return;
          }
          if (req.url.startsWith('/api/youtube-search')) {
            const urlObj = new URL(req.url, 'http://localhost');
            const q = urlObj.searchParams.get('q');
            if (!q) {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ videoId: null }));
              return;
            }
            fetch(`https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`, {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept-Language': 'en-US,en;q=0.9'
              }
            })
            .then(r => r.text())
            .then(html => {
              const match = html.match(/\/watch\?v=([a-zA-Z0-9_-]{11})/);
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ videoId: match ? match[1] : null }));
            })
            .catch(err => {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ videoId: null, error: err.message }));
            });
            return;
          }
          next();
        });
      }
    }
  ],
  base: './',
  optimizeDeps: {
    exclude: ['@coderline/alphatab']
  },
  server: {
    port: 5173,
    host: true,
    strictPort: true,
    proxy: {
      '/api/songsterr': {
        target: 'https://www.songsterr.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/songsterr/, '/api')
      }
    }
  },
  preview: {
    port: 5173,
    host: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
});

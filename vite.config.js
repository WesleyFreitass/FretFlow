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
    strictPort: true
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

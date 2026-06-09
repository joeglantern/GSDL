import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';
import { resolve, dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

function trailingSlash() {
  return {
    name: 'mpa-trailing-slash',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const pathname = (req.url || '/').split('?')[0];
        if (!pathname.includes('.') && !pathname.endsWith('/')) {
          req.url = req.url.replace(pathname, pathname + '/');
        }
        next();
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, _res, next) => {
        const pathname = (req.url || '/').split('?')[0];
        if (!pathname.includes('.') && !pathname.endsWith('/')) {
          req.url = req.url.replace(pathname, pathname + '/');
        }
        next();
      });
    },
  };
}

export default defineConfig({
  appType: 'mpa',
  plugins: [trailingSlash()],
  build: {
    rollupOptions: {
      input: {
        main:     resolve(__dirname, 'index.html'),
        mission:  resolve(__dirname, 'mission/index.html'),
        approach: resolve(__dirname, 'approach/index.html'),
        services: resolve(__dirname, 'services/index.html'),
        work:     resolve(__dirname, 'work/index.html'),
        contact:  resolve(__dirname, 'contact/index.html'),
      },
    },
  },
});

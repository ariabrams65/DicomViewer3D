import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        proxy: {
            '/api': {  // This is the prefix used for backend routes
                target: 'http://localhost:3000',  // The backend server
                changeOrigin: true,  // Necessary for virtual hosted sites
                rewrite: (path) => path.replace(/^\/api/, ''),
                secure: false
            }
        }
    }
});

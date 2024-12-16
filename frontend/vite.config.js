import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': `${import.meta.env.VITE_BASE_URL}`, // Forward API calls to Flask backend
    },
  },
});

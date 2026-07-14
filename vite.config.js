import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        contact: resolve(__dirname, 'contact.html'),
        hardware: resolve(__dirname, 'hardware.html'),
        service: resolve(__dirname, 'service.html'),
        software: resolve(__dirname, 'software.html'),
      },
    },
  },
});

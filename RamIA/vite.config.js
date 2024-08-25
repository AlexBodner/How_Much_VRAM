import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',  // This is the default output directory
  },
  base: './', // This ensures that the paths are relative, important for deploying to subdirectories
});
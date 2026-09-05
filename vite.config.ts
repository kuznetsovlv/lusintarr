import {fileURLToPath} from 'node:url';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import {defineConfig} from 'vite';

const indexEntry = fileURLToPath(new URL('./src/index.ts', import.meta.url));

const styleEntry = fileURLToPath(new URL('./src/styles.css', import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  build: {
    cssCodeSplit: true,

    lib: {
      entry: {
        index: indexEntry,
        style: styleEntry,
      },
      formats: ['es'],
      fileName: (_format, entryName) => `${entryName}.js`,
    },

    rolldownOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
      ],
    },
  },
});

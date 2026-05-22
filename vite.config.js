import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  const isLib = process.env.BUILD_LIB === 'true';

  if (isLib) {
    return {
      plugins: [react()],
      build: {
        lib: {
          entry: resolve(__dirname, 'src/index.js'),
          name: 'StoryBookComponents',
          fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
          formats: ['es', 'cjs'],
        },
        rollupOptions: {
          external: ['react', 'react-dom', 'react/jsx-runtime'],
          output: {
            globals: {
              react: 'React',
              'react-dom': 'ReactDOM',
              'react/jsx-runtime': 'react/jsx-runtime',
            },
          },
        },
        outDir: 'dist',
      },
    };
  }

  // Showcase App Mode (default Vite app build)
  return {
    plugins: [react()],
  };
});

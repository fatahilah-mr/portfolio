import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: 'https://fatahmr.my.id',
  build: {
    format: 'directory'
  },
  integrations: [react()]
});

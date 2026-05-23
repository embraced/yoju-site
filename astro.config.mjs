// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://yoju.embraced.co',
  integrations: [tailwind(), mdx()],
  output: 'static',
});

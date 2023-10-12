import path from 'path';
import { fileURLToPath } from 'url';

import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import NetlifyCMS from 'astro-netlify-cms';
import partytown from '@astrojs/partytown';
import compress from 'astro-compress';
import icon from 'astro-icon';
import tasks from './src/utils/tasks';
// import NetlifyCMS from 'astro-netlify-cms';

import { readingTimeRemarkPlugin } from './src/utils/frontmatter.mjs';

import { ANALYTICS, SITE } from './src/utils/config.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const whenExternalScripts = (items = []) =>
  ANALYTICS.vendors.googleAnalytics.id && ANALYTICS.vendors.googleAnalytics.partytown
    ? Array.isArray(items)
      ? items.map((item) => item())
      : [items()]
    : [];

export default defineConfig({
  site: SITE.site,
  base: SITE.base,
  trailingSlash: SITE.trailingSlash ? 'always' : 'never',

  output: 'static',

  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap({
      i18n: {
        defaultLocale: 'id',
        locales: {
          id: 'id',
          ja: 'ja',
        },
      },
    }),
    mdx(),
    NetlifyCMS({
      config: {
        backend: {
          name: 'git-gateway',
          branch: 'main',
          repo: 'hoshigakuenbali/lpk-hoshi-gakuen-bali',
          base_url: 'https://api.netlify.com',
          auth_endpoint: 'auth',
        },
        publish_mode: 'editorial_workflow',
        media_folder: '/public/images',
        public_folder: '/images',
        collections: [
          // Content collections
          {
            name: 'posts',
            label: 'Posts ID',
            folder: 'src/content/post/id',
            create: true,
            fields: [
              { label: 'Title', name: 'title', widget: 'string' },
              { label: 'Description', name: 'excerpt', widget: 'text' },
              { label: 'Date', name: 'publishDate', widget: 'datetime', format: 'YYYY-MM-DD' },
              // {
              //   label: 'Language',
              //   name: 'lang',
              //   widget: 'select',
              //   options: ['id', 'ja'],
              //   default: 'id',
              // },
              { label: 'Image', name: 'image', widget: 'image', required: false },
              { label: 'Author', name: 'author', widget: 'string', required: false },
              {
                label: 'Tags',
                name: 'tags',
                widget: 'list',
                allow_add: true,
                required: false,
              },
              {
                label: 'Category',
                name: 'category',
                widget: 'select',
                options: ['Kegiatan', 'Berita', 'Promosi', 'Tentang Jepang'],
              },

              { label: 'Draft', name: 'draft', widget: 'boolean', default: true, required: false },
              {
                label: 'Metadata',
                name: 'metadata',
                widget: 'object',
                required: false,
                fields: [
                  {
                    label: 'Canonical URL',
                    name: 'canonical',
                    widget: 'string',
                    required: false,
                    hint: 'Hanya tulis URL dari post yg telah terpublish (optional)',
                  },
                ],
              },
              { label: 'Body', name: 'body', widget: 'markdown' },
            ],
          },
          {
            name: 'posts_ja',
            label: 'Posts JA',
            folder: 'src/content/post/ja',
            create: true,
            fields: [
              { label: 'Title', name: 'title', widget: 'string' },
              { label: 'Description', name: 'excerpt', widget: 'text' },
              { label: 'Date', name: 'publishDate', widget: 'datetime', format: 'YYYY-MM-DD' },
              // {
              //   label: 'Language',
              //   name: 'lang',
              //   widget: 'select',
              //   options: ['id', 'ja'],
              //   default: 'id',
              // },
              { label: 'Image', name: 'image', widget: 'image', required: false },
              { label: 'Author', name: 'author', widget: 'string', required: false },
              {
                label: 'Tags',
                name: 'tags',
                widget: 'list',
                allow_add: true,
                required: false,
              },
              {
                label: 'Category',
                name: 'category',
                widget: 'select',
                options: ['Kegiatan', 'Berita', 'Promosi', 'Tentang Jepang'],
              },

              { label: 'Draft', name: 'draft', widget: 'boolean', default: true, required: false },
              {
                label: 'Metadata',
                name: 'metadata',
                widget: 'object',
                required: false,
                fields: [
                  {
                    label: 'Canonical URL',
                    name: 'canonical',
                    widget: 'string',
                    required: false,
                    hint: 'Hanya tulis URL dari post yg telah terpublish (optional)',
                  },
                ],
              },
              { label: 'Body', name: 'body', widget: 'markdown' },
            ],
          },
        ],
      },
    }),
    icon({
      include: {
        tabler: ['*'],
        'flat-color-icons': [
          'template',
          'gallery',
          'approval',
          'document',
          'advertising',
          'currency-exchange',
          'voice-presentation',
          'business-contact',
          'database',
        ],
      },
    }),

    ...whenExternalScripts(() =>
      partytown({
        config: { forward: ['dataLayer.push'] },
      })
    ),

    tasks(),

    compress({
      CSS: true,
      HTML: {
        removeAttributeQuotes: false,
      },
      Image: false,
      JavaScript: true,
      SVG: true,
      Logger: 1,
    }),
  ],

  markdown: {
    remarkPlugins: [readingTimeRemarkPlugin],
  },

  vite: {
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src'),
      },
    },
  },
});

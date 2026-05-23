import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import fs from 'node:fs';
import path from 'node:path';

export const getStaticPaths: GetStaticPaths = async () => {
  const articles = await getCollection('articles');
  return articles.map((article) => ({
    params: { slug: article.slug },
    props: { article },
  }));
};

export const GET: APIRoute = async ({ props }) => {
  const { article } = props as { article: Awaited<ReturnType<typeof getCollection<'articles'>>>[number] };
  const { title, tldr, category } = article.data;

  const fontPath = path.join(process.cwd(), 'public/fonts/NotoSansTC-Bold.ttf');
  let fontData: Buffer;
  try {
    fontData = fs.readFileSync(fontPath);
  } catch {
    throw new Error(`OG font not found at ${fontPath}. Run: cp node_modules/@fontsource-variable/noto-sans-tc/files/noto-sans-tc-chinese-traditional-700-normal.woff2 public/fonts/ and convert to TTF, or place NotoSansTC-Bold.ttf in public/fonts/`);
  }

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '1200px',
          height: '630px',
          backgroundColor: '#fdf6ee',
          display: 'flex',
          flexDirection: 'column',
          padding: '64px',
          fontFamily: 'Noto Sans TC',
          boxSizing: 'border-box',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '28px',
              },
              children: [
                {
                  type: 'span',
                  props: {
                    style: {
                      backgroundColor: '#fff3e8',
                      color: '#e07b39',
                      padding: '6px 16px',
                      borderRadius: '999px',
                      fontSize: '22px',
                      fontWeight: 700,
                    },
                    children: category,
                  },
                },
              ],
            },
          },
          {
            type: 'div',
            props: {
              style: {
                fontSize: '46px',
                fontWeight: 700,
                color: '#3a2010',
                lineHeight: 1.3,
                marginBottom: '24px',
                flex: 1,
                maxWidth: '1072px',
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 3,
                overflow: 'hidden',
              },
              children: title,
            },
          },
          {
            type: 'div',
            props: {
              style: {
                fontSize: '26px',
                color: '#5a4030',
                lineHeight: 1.5,
                marginBottom: '32px',
                borderLeft: '4px solid #e07b39',
                paddingLeft: '20px',
                maxWidth: '1048px',
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 2,
                overflow: 'hidden',
              },
              children: tldr,
            },
          },
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              },
              children: [
                {
                  type: 'span',
                  props: {
                    style: { fontSize: '28px', fontWeight: 700, color: '#e07b39' },
                    children: '有據 yoju',
                  },
                },
                {
                  type: 'span',
                  props: {
                    style: { fontSize: '20px', color: '#888' },
                    children: '僅供參考・請諮詢醫師',
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Noto Sans TC', data: fontData, weight: 700, style: 'normal' },
      ],
    },
  );

  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } });
  const png = resvg.render().asPng();

  return new Response(png, {
    headers: { 'Content-Type': 'image/png' },
  });
};

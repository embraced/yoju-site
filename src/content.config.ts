import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const SourceSchema = z.object({
  title: z.string(),
  url: z.string().url(),
  journal: z.string().optional(),
  quartile: z.enum(['Q1', 'Q2', 'Q3', 'Q4', 'official']).optional(),
  doi: z.string().optional(),
  retracted: z.boolean().default(false),
});

const SupersededBySchema = z.object({
  slug: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD'),
  title: z.string(),
});

const articles = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD'),
    category: z.enum([
      '老年醫學',
      '心血管',
      '腦部健康',
      '骨骼關節',
      '代謝疾病',
      '感官退化',
    ]),
    lifestage: z.enum(['elderly', 'middle-age', 'both']).default('elderly'),
    tags: z.array(z.string()),
    tldr: z.string().max(200),
    confidence: z.enum(['high', 'medium']),
    sources: z.array(SourceSchema).min(1),
    topic_key: z.string().optional(),       // stable identifier for augment chain
    superseded_by: SupersededBySchema.optional(),  // pointer to latest version
  }),
});

export const collections = { articles };

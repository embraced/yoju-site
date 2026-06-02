import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { CATEGORIES } from './categories';

const SourceSchema = z.object({
  title: z.string(),
  url: z.string().url(),
  journal: z.string().optional(),
  quartile: z.enum(['Q1', 'Q2', 'Q3', 'Q4', 'official']).optional(),
  doi: z.string().optional(),
  retracted: z.boolean().default(false),
  cited: z.boolean().optional(),  // referenced inline by [N]? drives SourceList grouping
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
    category: z.enum(CATEGORIES),
    lifestage: z.enum(['elderly', 'middle-age', 'both']).default('elderly'),
    tags: z.array(z.string()),
    tldr: z.string().max(200),
    confidence: z.enum(['high', 'medium']),
    sources: z.array(SourceSchema).min(1),
    topic_key: z.string().optional(),       // stable identifier for augment chain
    related_topic_keys: z.array(z.string()).optional(),  // explicit pathway graph for footer
    aliases: z.array(z.string()).optional(),  // keywords that auto-link FROM other articles TO this one
    superseded_by: SupersededBySchema.optional(),  // pointer to latest version (this article is old)
    previous_version: SupersededBySchema.optional(),  // pointer to prior version (this article is augment)
  }),
});

export const collections = { articles };

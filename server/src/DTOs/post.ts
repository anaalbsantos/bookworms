import { z } from 'zod';

export const Post = z.object({
  title: z.string({ required_error: 'Title is required' }),
  body: z.string().optional(),
  image: z.string({ required_error: 'Image is required' }),
  numPages: z.coerce.number(),
  authorId: z.string({ required_error: 'authorId is required' }),
  groupId: z.string({ required_error: 'groupId is required' }),
});

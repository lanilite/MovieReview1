import { z } from "zod";

export const formSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  posterUrl: z.string().url(),
});

export type FormSchema = z.infer<typeof formSchema>;

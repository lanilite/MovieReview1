import { z } from "zod";

export const formSchema = z.object({
  comment: z.string().min(1),
  rating: z.number().int().min(1).max(5),
});

export type FormSchema = z.infer<typeof formSchema>;

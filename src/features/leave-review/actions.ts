"use server";

import { db } from "@/db";
import { type NewReview, reviews } from "@/db/schema";
import { formSchema } from "./schema";
import { revalidatePath } from "next/cache";

export async function leaveReview(data: NewReview) {
  const parsedData = formSchema.parse(data);

  await db
    .insert(reviews)
    .values({ ...parsedData, authorId: data.authorId, movieId: data.movieId });

  revalidatePath(`/movies/${data.movieId}`);
  revalidatePath("/");
}

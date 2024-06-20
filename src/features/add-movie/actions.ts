"use server";

import { db } from "@/db";
import { movies } from "@/db/schema";
import { revalidatePath } from "next/cache";

export async function addMovie({
  title,
  description,
  posterUrl,
}: {
  title: string;
  description: string;
  posterUrl: string;
}) {
  const [movie] = await db
    .insert(movies)
    .values({ title, description, posterUrl })
    .returning({ id: movies.id });

  revalidatePath("/");
  revalidatePath(`/movie/${movie.id}`);
}

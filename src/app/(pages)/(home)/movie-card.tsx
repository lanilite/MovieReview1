import Link from "next/link";
import Image from "next/image";
import { Rating } from "@/components/rating";
import { db } from "@/db";
import { movies } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export function MovieCard({
  id,
  title,
  description,
  posterUrl,
  rating,
  isAdmin = false,
}: {
  id: number;
  title: string | null;
  description: string | null;
  posterUrl: string | null;
  rating?: number | null;
  isAdmin?: boolean;
}) {
  return (
    <div className="flex flex-col justify-between bg-card rounded-md max-w-64">
      <Link
        href={`/movies/${id}`}
        className="overflow-hidden h-96 rounded-t-md bg-black grid place-items-center group"
      >
        <Image
          src={posterUrl!}
          alt={`${title} poster`}
          width={256}
          height={384}
          className="object-contain max-w-64 max-h-96 group-hover:opacity-80 transition-opacity"
        />
      </Link>

      <div className="p-4 space-y-1">
        <div className="flex justify-between items-center">
          <Rating starCount={rating ?? 0} />

          {isAdmin && (
            <form
              action={async () => {
                "use server";

                await db.delete(movies).where(eq(movies.id, id));

                revalidatePath("/");
                revalidatePath(`/movies/${id}`);
              }}
            >
              <button type="submit" className="text-sm text-destructive">
                Delete
              </button>
            </form>
          )}
        </div>

        <Link href={`/movies/${id}`}>
          <h2 className="text-card-foreground line-clamp-1">{title}</h2>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
        </Link>
      </div>
    </div>
  );
}

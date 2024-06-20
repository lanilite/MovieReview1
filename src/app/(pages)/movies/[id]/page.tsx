import { db } from "@/db";
import { movies, reviews, users } from "@/db/schema";
import { avg, count, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ReviewForm } from "@/features/leave-review/review-form";
import { auth } from "@/auth";
import { Rating } from "@/components/rating";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

export default async function Movie({ params }: { params: { id: string } }) {
  const [movie] = await db
    .select({
      id: movies.id,
      title: movies.title,
      description: movies.description,
      rating: avg(reviews.rating),
      reviewCount: count(reviews.id),
      posterUrl: movies.posterUrl,
    })
    .from(movies)
    .where(eq(movies.id, +params.id))
    .leftJoin(reviews, eq(reviews.movieId, movies.id))
    .groupBy(movies.id);

  const reviewList = await db
    .select({
      id: reviews.id,
      rating: reviews.rating,
      comment: reviews.comment,
      authorName: users.name,
      authorImage: users.image,
    })
    .from(reviews)
    .leftJoin(users, eq(users.id, reviews.authorId))
    .where(eq(reviews.movieId, +params.id));

  if (!movie) {
    return notFound();
  }

  const starCount = Math.round(parseFloat(movie.rating ?? "0"));

  const session = await auth();

  return (
    <main className="container py-16">
      <div className="grid grid-cols-[max-content,_1fr] gap-8 mb-8">
        <div className="bg-background rounded-md overflow-hidden max-w-64 h-fit">
          <Image
            src={movie.posterUrl!}
            width={256}
            height={384}
            alt={`${movie.title} poster`}
          />

          <div className="p-4 space-y-1 mt-2">
            <h1 className="text-xl font-medium">{movie.title}</h1>

            <Rating
              starCount={starCount}
              rating={+parseFloat(movie.rating ?? "0").toFixed(1)}
              reviewCount={movie.reviewCount}
            />

            <p className="text-sm text-muted-foreground">{movie.description}</p>
          </div>
        </div>

        <ul className="space-y-4">
          {reviewList.map(
            ({ id, rating, comment, authorName, authorImage }) => (
              <li
                key={id}
                className="bg-background rounded-md p-4 grid grid-cols-[max-content,_1fr] gap-2"
              >
                <Avatar>
                  <AvatarImage src={authorImage!} />
                  <AvatarFallback>{authorName?.at(0)}</AvatarFallback>
                </Avatar>

                <div>
                  <div className="flex gap-2">
                    <span className="text-sm font-medium">{authorName}</span>
                  </div>

                  <div>{comment}</div>
                </div>

                <Rating starCount={rating || 0} className="col-span-2" />
              </li>
            ),
          )}
        </ul>
      </div>

      <ReviewForm movieId={movie.id} authorId={session?.user?.id} />
    </main>
  );
}

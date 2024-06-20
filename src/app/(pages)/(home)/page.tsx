import { db } from "@/db";
import { movies, reviews } from "@/db/schema";
import { Filters } from "./filters";
import { asc, avg, desc, eq, ilike, sql } from "drizzle-orm";
import { MovieCard } from "./movie-card";
import { auth } from "@/auth";

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await auth();

  const movieList = await db
    .select({
      id: movies.id,
      title: movies.title,
      posterUrl: movies.posterUrl,
      description: movies.description,
      rating: avg(reviews.rating),
    })
    .from(movies)
    .where(ilike(movies.title, `%${searchParams.title || ""}%`))
    .leftJoin(reviews, eq(reviews.movieId, movies.id))
    .groupBy(movies.id)
    .orderBy(
      searchParams.sort === "asc"
        ? sql`COALESCE(AVG(reviews.rating), -1) ASC;`
        : sql`COALESCE(AVG(reviews.rating), -1) DESC;`,
    );

  return (
    <main className="container py-16">
      <section className="flex flex-col items-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight">
          Welcome to Movie Review
        </h1>

        <p className="text-xl text-muted-foreground mt-2">
          Your ultimate destination for movie reviews and ratings.
        </p>

        <div className="flex gap-8 mt-8 justify-center">
          <article className="p-6 rounded-md bg-card text-card-foreground max-w-64">
            <h2 className="text-2xl font-semibold tracking-tight text-primary">
              Discover Movies
            </h2>
            <p className="leading-7 mt-2">
              Explore a wide range of movies and read reviews from other movie
              enthusiasts.
            </p>
          </article>

          <article className="p-6 rounded-md bg-card text-card-foreground max-w-64">
            <h2 className="text-2xl font-semibold tracking-tight text-primary">
              Discover Movies
            </h2>
            <p className="leading-7 mt-2">
              Explore a wide range of movies and read reviews from other movie
              enthusiasts.
            </p>
          </article>

          <article className="p-6 rounded-md bg-card text-card-foreground max-w-64">
            <h2 className="text-2xl font-semibold tracking-tight text-primary">
              Discover Movies
            </h2>
            <p className="leading-7 mt-2">
              Explore a wide range of movies and read reviews from other movie
              enthusiasts.
            </p>
          </article>
        </div>
      </section>

      <Filters />

      <section className="mt-8">
        <ul className="flex flex-wrap justify-center gap-8">
          {movieList.map((movie) => (
            <li key={movie.id}>
              <MovieCard
                {...movie}
                rating={Math.round(parseFloat(movie.rating ?? "0"))}
                isAdmin={session?.user.role === "admin"}
              />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

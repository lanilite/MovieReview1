import {
  text,
  serial,
  pgTable,
  integer,
  timestamp,
  primaryKey,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  role: text("role").default("user"),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  }),
);

export const genres = pgTable("genres", {
  id: serial("id").primaryKey(),
  name: text("name"),
});

export type Genre = typeof genres.$inferSelect;
export type NewGender = typeof genres.$inferInsert;

export const movies = pgTable("movies", {
  id: serial("id").primaryKey(),
  title: text("title"),
  description: text("description"),
  posterUrl: text("poster_url"),
  releaseDate: text("release_date"),
});

export type Movie = typeof movies.$inferSelect;
export type NewMovie = typeof movies.$inferInsert;

export const MovieGenres = pgTable(
  "movie_genres",
  {
    movieId: serial("movie_id"),
    genreId: serial("genre_id"),
  },
  (movieGenre) => ({
    compoundKey: primaryKey({
      columns: [movieGenre.movieId, movieGenre.genreId],
    }),
  }),
);

export type MovieGenre = typeof MovieGenres.$inferSelect;
export type NewMovieGenre = typeof MovieGenres.$inferInsert;

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  movieId: serial("movie_id").notNull(),
  rating: integer("rating"),
  comment: text("comment"),
  authorId: text("author_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;

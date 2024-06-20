import dotenv from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { type NewMovie, movies } from "./schema";

dotenv.config({ path: ".env.local" });

const main = async () => {
  const sql = neon(process.env.DRIZZLE_DATABASE_URL!);

  const db = drizzle(sql);

  const values: NewMovie[] = [
    {
      title: "The Shawshank Redemption",
      description:
        "Over the course of several years, two convicts form a friendship, seeking consolation and, eventually, redemption through basic compassion.",
      posterUrl:
        "https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_FMjpg_UX1200_.jpg",
      releaseDate: "1994-09-23",
    },
    {
      title: "The Godfather",
      description:
        "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
      posterUrl: "https://m.media-amazon.com/images/I/51v5ZpFyaFL._AC_.jpg",
      releaseDate: "1972-03-24",
    },
    {
      title: "The Dark Knight",
      description:
        "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept",
      posterUrl: "https://m.media-amazon.com/images/I/51lRlY1K2RL._AC_.jpg",
      releaseDate: "2008-07-18",
    },
  ];

  await db.insert(movies).values(values);
};

main();

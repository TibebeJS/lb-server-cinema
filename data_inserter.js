require("dotenv").config();

const tmdb = require("../tmdb-api");

const OMDB_KEY = process.env.OMDB_KEY;

const omdb = new (require("omdbapi"))(OMDB_KEY);

const models = require("./models");

(async () => {
  const { Movie } = await models.bootstrap();

  const savedMovies = await Movie.findAll();

  console.log(savedMovies);

  const data = JSON.parse(
    (
      await tmdb.nowPlayingOnCinema({
        page: 1,
        language: "en-US",
        region: "US",
      })
    ).body
  );

  const movies = data.results
    .filter(({ original_language }) => original_language === "en")
    .sort((x, y) => y.popularity - x.popularity)
    .slice(0, 10)
    .map(
      ({ poster_path, id, title, vote_average, overview, release_date }) => ({
        poster_path,
        id,
        title,
        vote_average,
        overview,
        release_date,
      })
    );

  for (const movie of movies) {
    const {
      id,
      poster_path,
      title,
      vote_average,
      overview,
      release_date,
    } = movie;
    try {
      const detail = await omdb.get({
        title: movie.title,
        year: movie.release_date.split("-")[0],
      });

      await Movie.create({
        id,
        overview,
        poster_path,
        release_date,
        title,
        vote: vote_average,
      });
      console.log(
        `[+] SUCCESSFULLY INSERTED A NEW MOVIE:\n\t${title} - ${release_date}`
      );
    } catch (err) {
      console.log(`[-] Failed to insert:\n\t${title} - ${release_date}`);
      console.log(err);
    }
  }
})();

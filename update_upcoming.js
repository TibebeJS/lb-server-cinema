require("dotenv").config();

const tmdb = require("./tmdb-api");

const OMDB_KEY = process.env.OMDB_KEY;

const omdb = new (require("omdbapi"))(OMDB_KEY);

const models = require("./models");

const apiKey = process.env.API_KEY;

(async () => {
  const { UpcomingMovie } = await models.bootstrap();

  const data = JSON.parse((await tmdb.upcomingMovies()).body);
  // console.log(data.results[0]);

  const movies = data.results
    .filter(({ original_language }) => original_language === "en")
    .sort((x, y) => y.popularity - x.popularity)
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

  await UpcomingMovie.destroy({
    where: {},
    truncate: true,
  });

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
      await UpcomingMovie.create({
        overview,
        poster_path,
        release_date,
        title,
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

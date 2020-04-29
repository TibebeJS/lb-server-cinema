const models = require("./models");

(async () => {
  const {
    MovieType,
    SeatType,
    Cinema,
    Movie,
    Schedule,
  } = await models.bootstrap();

  const MODE = false;

  if (MODE) {
    const movie = await Movie.findAll({
      where: {
        id: 1,
      },
    });

    const cinema = await Cinema.findOne({
      where: {
        id: 1,
      },
    });

    // console.log(cinema)

    const type = await MovieType.findOne({
      where: {
        name: "2D",
      },
    });

    // console.log(type)

    const schedule = await Schedule.create({
      date: Date.now(),
      time: "03:25:00",
    });

    await schedule.setCinema(cinema);
    // await schedule.setMovie(movie);
    await schedule.setMovieType(type);

    console.log(schedule);

    return;
  }

  // seed Movie-Types
  const movieTypes = [
    {
      title: "2D Movies",
      name: "2D",
    },
    {
      title: "3D Movies",
      name: "3D",
    },
  ];

  for (let { title, name } of movieTypes) {
    try {
      await MovieType.create({
        name,
        title,
        description: "",
      });
    } catch (error) {}
  }
  // end

  // seed Seat-Types
  const seatTypes = ["Standard", "Deluxe", "Gold", "VIP", "NOT-SEAT"];

  for (let seatType of seatTypes) {
    try {
      await SeatType.create({
        name: seatType,
        description: `${seatType} seat type`,
      });
    } catch (error) {}
  }
  // end

  // seed Cinemas
  const cinemas = ["Cinema 1", "Cinema 2", "Gold 1", "Gold 2"];

  for (let cinema of cinemas) {
    try {
      await Cinema.create({
        name: cinema,
        description: `${cinema} cinema`,
      });
    } catch (error) {}
  }
  // end
})();

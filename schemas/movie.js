const schema = {
  $id: "movie",
  type: "object",
  properties: {
    id: { type: "string" },
    overview: { type: "string" },
    poster_path: { type: "string" },
    release_date: {
      type: "string",
    },
    title: {
      type: "string",
    },
    youtubeId: {
      type: "string",
    },
    vote: {
      type: "integer",
    },
  },
};

module.exports = schema;

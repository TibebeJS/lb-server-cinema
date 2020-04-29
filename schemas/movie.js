const schema = {
  $id: "movie",
  type: "object",
  properties: {
    id: { type: "integer" },
    overview: { type: "string" },
    poster_path: { type: "string" },
    release_date: {
      type: "string",
    },
    title: {
      type: "string",
    },
    vote: {
      type: "integer",
    },
  },
};

module.exports = schema;

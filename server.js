const app = require("./app");
const mongoose = require("./db/mongooseConnection");

const { PORT = 3000 } = process.env;

mongoose.connection.once("open", () => {
  app.listen(PORT, () => {
    console.log("Server is listening");
  });
});
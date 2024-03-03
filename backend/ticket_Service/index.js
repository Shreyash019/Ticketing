const mongoose = require("mongoose");
const server = require("./app.js");
const port = process.env.USERPORT || 5003;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log(`Database connection successful...`);
  });

server.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
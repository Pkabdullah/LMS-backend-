const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const port = 8000;

const mongoose = require("mongoose");
const Route = require("./routes/route");
const adminRoutes = require("./routes/adminRoutes")
const cors = require("cors");
const cookiesParser = require("cookie-parser");
const { checkForAuthenticationCookies } = require("./middleware/auth");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin:  "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookiesParser());
app.use(checkForAuthenticationCookies("token"));


mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Mongo db is connected successfully");
  })
  .catch((error) => {
    console.log(`Error${error}`);
  });
app.use("/", Route);
app.use('/admin', adminRoutes);

app.listen(port, () => {
  console.log(`Server started on port${port} successfully`);
});

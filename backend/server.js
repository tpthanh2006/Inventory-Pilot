const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();
const userRoute = require("./routes/userRoute");
const app = express();
const errorHandler = require("./middleware/errorMiddleware");
const cookieParser = require("cookie-parser");

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false}));
app.use(bodyParser.json());

// Routes Middleware
app.use("/api/users", userRoute);

// Routes 
app.get("/", (req, res) => {
  res.send("Home Page");
})

// Error Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    })
  })
  .catch((err) => console.log(err))


const express = require("express")

const app = express()


// Routes
app.get("/", (req, res) => {
  res.send("<h2>Welcome to Home Page (Express.JS)</h2>")
})

app.get("/about", (req, res) => {
  res.send("<h2> Welcome to the About Page</h2>")
})

app.listen("5000", () => {
  console.log("Server running on port 5000");
})
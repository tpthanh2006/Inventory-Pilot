const http = require("http");

const server = http.createServer((req, res) => {
  // Routes
  if (req.url === "/") {
    res.setHeader("Content-Type", "text/html");
    res.write("<h2>Home Page...</h2>");
    res.end();
  }
  if (req.url === "/about") {
    res.setHeader("Content-Type", "text/html");
    res.write("<h2>About Page...</h2>");
    res.end();
  }
})

server.listen("5000", "localhost", () => {
  console.log("Server running on port 5000");
});
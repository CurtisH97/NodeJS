const http = require("http");
const path = require("path");
const logEvents = require("./logEvents");
const fs = require("fs");

const server = http.createServer((req, res) => {
    logEvents("Server started");
  if (req.url.startsWith("/images/") && req.method === "GET") {
    // Extract the file name from the URL
    const fileName = path.basename(req.url);

    // Check if the file exists
    const filePath = path.join(__dirname, "images", fileName);
    if (fs.existsSync(filePath)) {
      // Read the file and send it as a response
      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.statusCode = 500;
          res.end("Internal Server Error");
        } else {
          res.setHeader("Content-Type", "image/png");
          res.end(data);
        }
      });
    } else {
      // File not found
      res.statusCode = 404;
      res.end("File not found");
    }
  } else {
    // Serve the index.html file for other requests
    res.setHeader("Content-Type", "text/html");
    fs.readFile(path.join(__dirname, "views", "index.html"), (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.end("Internal Server Error");
      } else {
        res.end(data);
      }
    });
  }
});

server.listen(3000, () => {
  console.log("Server is listening on port 3000");
});

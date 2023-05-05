// Import required modules
const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

// Create an instance of express app
const app = express();

// Use body-parser middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Define a route to handle GET requests to the home page
app.get("/", (req, res) => {
  res.send(`
    <html>
      <body>
        <form method="POST" action="/createFile">
          <label for="filename">Enter a filename:</label>
          <input type="text" id="filename" name="filename">
          <br><br>
          <label for="regNo">Registration number:</label>
          <input type="text" id="regNo" name="regNo">
          <br><br>
          <label for="name">Name:</label>
          <input type="text" id="name" name="name">
          <br><br>
          <label for="grade">Grade:</label>
          <input type="text" id="grade" name="grade">
          <br><br>
          <button type="submit">Create file</button>
        </form>
      </body>
    </html>
  `);
});

// Define a route to handle POST requests to create a file
app.post("/createFile", (req, res) => {
  const { filename, regNo, name, grade } = req.body;
  const filePath = path.join(__dirname, filename);

  // Create the file if it does not exist
  if (!fs.existsSync(filePath)) {
    const studentInfo = `Reg. No.: ${regNo}, Name: ${name}, Grade: ${grade}\n`;
    fs.writeFile(filePath, studentInfo, (err) => {
      if (err) {
        res.status(500).send("Error creating file");
      } else {
        res.send(`File ${filename} created successfully`);
      }
    });
  } else {
    res.status(400).send("File already exists");
  }
});

// Define a route to handle GET requests to transfer files
app.get("/getFile", (req, res) => {
  const { filename } = req.query;
  const filePath = path.join(__dirname, filename);

  // Check if the file exists
  if (!fs.existsSync(filePath)) {
    res.status(404).send("File not found");
    return;
  }

  // Send the file using sendFile function
  res.sendFile(filePath);
});

// Start the server
app.listen(3000, () => {
  console.log("Server started on port 3000");
});

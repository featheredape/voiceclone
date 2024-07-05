const express = require("express");
const multer = require("multer");
const app = express();
const PORT = 3000;

// Set up storage using multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + ".m4a");
  },
});

const upload = multer({ storage: storage });

// Routes
app.post("/upload", upload.single("audio"), (req, res) => {
  console.log("Received file: " + req.file.filename);
  res.json({ message: "Successfully uploaded " + req.file.filename });
});

app.get("/:universalURL", (req, res) => {
  res.send("404 URL NOT FOUND");
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

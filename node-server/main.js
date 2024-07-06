const express = require("express");
const multer = require("multer");
const cors = require('cors');
const app = express();
const PORT = 3000;



const upload = multer({ dest: 'uploads' });

// const upload = multer({
//   storage: multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, "uploads/");
//     },
//     filename: (req, file, cb) => {
//       cb(null, file.fieldname + "-" + Date.now() + ".m4a");
//     },
//   })
// });

app.use(cors());
app.use(express.static('static'));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // allow any origin
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

// Routes
app.post("/upload", upload.single("audio"), (req, res) => {
  console.log(req.file)
  console.log("Received file: " + req.file.filename);
  res.json({
    uploadId: req.file.filename,
    message: "Successfully uploaded " + req.file.filename
  });
});

app.use("/uploads", express.static('uploads'));

app.get("/play", async (req, res) => {
  const formData = new FormData();
  formData.append(
    "text",
    "Thank you for lending me your voice. Over time, I will start to sound more and more like you.",
  );
  //change stephen.m4a to outaudio.mp4
  formData.append(
    "speaker_ref_path",
    `http://localhost:${PORT}/uploads/${req.query.uploadId}`,
  );
  formData.append("guidance", "5.0");
  formData.append("top_p", "0.98");
  
  try {
    const response = await fetch("http://0.0.0.0:58003/tts", {
      method: "POST",
      body: formData,
    });
    res.send(response.body);
  } catch (err) {
    res.status(400);
    res.json({
      message: 'failed to play',
    })
    console.log('failed :(');
  }
})


app.get("/:universalURL", (req, res) => {
  res.send("404 URL NOT FOUND");
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
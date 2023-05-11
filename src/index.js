const express = require("express");
const fileUpload = require("express-fileupload");
const app = new express();
const config = require("./config.json");

const Files = require("./schemas/file");

const mongoose = require("mongoose");
mongoose
  .connect(config.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((e) => console.log("Database connection failed!"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(fileUpload());

app.set("view engine", "hbs");

app.get("/", (req, res) => {
  res.render("index.hbs", { title: "Upload File" });
});

app.get("/files/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) return res.json({ err: "Missing ID Param" });
  const file = await Files.findOne({ url: id });
  if (!file) return res.json({ err: `File with ID ${id} not found` });
  res.render("download.hbs", {
    downloadUrl: `${config.domain}/api/download/${id}`,
    file,
  });
});

app.get("/api/download/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) return res.json({ err: "Missing ID Param" });
  const file = await Files.findOne({ url: id });
  if (!file) return res.json({ err: `File with ID ${id} not found` });
  const filePath = `${__dirname}/data/files/${file.file}`;
  await res.download(filePath, file.fileName);
});

app.post("/api/upload", async (req, res) => {
  if (!req.files || !req.files?.file)
    return res.status(500).json({ error: "Invalid POST Request" });

  try {
    const file = req.files?.file;
    const size = file.data.length;
    if (size > config.maxFileSizeMB * 1000000) throw "File size is too large";

    const URL = `./data/files/${file.md5}`;
    file.mv(URL);

    const createdFile = await Files.create({
      file: file.md5,
      fileName: file.name,
    });

    res.status(200).json({
      message: `File has been uploaded`,
      shortUrl: createdFile.url,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error,
    });
  }
});

app.listen(config.port);

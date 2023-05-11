const mongoose = require("mongoose");
const shortid = require("shortid");

const fileSchema = new mongoose.Schema({
  url: { type: String, required: true, default: shortid.generate },
  file: { type: String, required: true },
  fileName: { type: String, required: true },
});

module.exports = mongoose.model("File", fileSchema);

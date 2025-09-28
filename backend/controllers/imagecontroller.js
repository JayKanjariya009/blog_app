// filepath: c:\Users\jayka\Desktop\Project\blog_app\backend\controllers\imageController.js
const mongoose = require("mongoose");
const Grid = require("gridfs-stream");

let gfs;
mongoose.connection.once("open", () => {
  gfs = Grid(mongoose.connection.db, mongoose.mongo);
  // Specify bucket name
  gfs.collection("uploads");
});

const getImage = (req, res) => {
  const fileName = req.params.filename;
  gfs.files.findOne({ filename: fileName }, (err, file) => {
    if (!file || file.length === 0) {
      return res.status(404).json({ error: "No file exists" });
    }
    // If image, set content type and stream to response
    if (file.contentType === "image/jpeg" || file.contentType === "image/png") {
      res.set("Content-Type", file.contentType);
      const readstream = gfs.createReadStream(file.filename);
      return readstream.pipe(res);
    } else {
      return res.status(404).json({ error: "Not an image" });
    }
  });
};

module.exports = { getImage };
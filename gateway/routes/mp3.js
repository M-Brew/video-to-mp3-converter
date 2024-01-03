const router = require("express").Router();
const path = require("path");
const fs = require("fs");
const { GridFSBucket, ObjectId } = require("mongodb");
require("dotenv").config();
const { MP3_MONGO_URI } = process.env;

const { connectToDB, getDB } = require("../db");
const { validateAuth } = require("../middlewares/validateAuth");

let bucket;
connectToDB(MP3_MONGO_URI, (error) => {
  if (!error) {
    const db = getDB();
    bucket = new GridFSBucket(db, { bucketName: "mp3s" });
  }
});

router.get("/download/:id", async (req, res) => {
  try {
    const mp3Id = req.params.id;

    if (!ObjectId.isValid(mp3Id)) {
      return res.status(404).json({ error: "Invalid file id" });
    }

    await bucket.openDownloadStream(new ObjectId(mp3Id)).pipe(res);

    // await bucket
    //   .openDownloadStream(new ObjectId(mp3Id))
    //   .pipe(fs.createWriteStream(`./utils/${mp3Id}.mp3`));

    // res.status(200).download(path.join(__dirname, `../utils/${mp3Id}.mp3`));
    // fs.unlink(path.join(__dirname, `../utils/${mp3Id}.mp3`), (err) => {
    //   if (err) {
    //     return res.sendStatus(500);
    //   }

    //   return res.sendStatus(200);
    // });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

module.exports = router;

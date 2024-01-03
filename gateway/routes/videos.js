const router = require("express").Router();
const { GridFSBucket } = require("mongodb");
const amqp = require("amqplib");
require("dotenv").config();
const { MONGO_URI, RABBIT_SERVICE, VIDEO_QUEUE } = process.env;

const { upload } = require("../middlewares/uploadFile");
const { validateAuth } = require("../middlewares/validateAuth");
const { uploadToGridFs } = require("../utils/gridFSUpload");
const { connectToDB, getDB } = require("../db");

let bucket;
connectToDB(MONGO_URI, (error) => {
  if (!error) {
    const db = getDB();
    bucket = new GridFSBucket(db, { bucketName: "videos" });
  }
});

router.post(
  "/upload",
  validateAuth,
  upload.single("video"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ video: "Video is required" });
      }

      // amqp connection
      const amqpConnection = await amqp.connect({
        hostname: RABBIT_SERVICE,
        port: 5672,
        username: "guest",
        password: "guest",
      });
      const channel = await amqpConnection.createChannel();

      const error = await uploadToGridFs(req.file, bucket, channel, req.user);
      if (error) {
        return res.sendStatus(500);
      }

      return res.sendStatus(201);
    } catch (error) {
      console.log(error);
    }
  }
);

module.exports = router;

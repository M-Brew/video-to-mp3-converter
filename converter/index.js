const express = require("express");
const { GridFSBucket } = require("mongodb");
const cors = require("cors");
const amqp = require("amqplib");
require("dotenv").config();

const { connectToDB, getDB } = require("./db");
const { toMP3 } = require("./utils/toMP3");
const { PORT, VIDEOS_DB_URI, MP3_DB_URI, RABBIT_SERVICE, VIDEO_QUEUE } =
  process.env;

const app = express();

app.use(cors());

async function consume(videosBucket, mp3Bucket) {
  // amqp connection
  const amqpConnection = await amqp.connect({
    hostname: RABBIT_SERVICE,
    port: 5672,
    username: "guest",
    password: "guest",
  });
  const channel = await amqpConnection.createChannel();

  const callback = async (message) => {
    const error = await toMP3(
      JSON.parse(message.content.toString()),
      videosBucket,
      mp3Bucket,
      channel
    );
    if (error) {
      channel.nack(message);
    } else {
      channel.ack(message);
    }
  };

  await channel.assertQueue(VIDEO_QUEUE);
  channel.consume(VIDEO_QUEUE, callback);
}

connectToDB(VIDEOS_DB_URI, (error) => {
  if (!error) {
    const db = getDB();
    const videosBucket = new GridFSBucket(db, { bucketName: "videos" });
    connectToDB(MP3_DB_URI, (error) => {
      if (!error) {
        const db = getDB();
        const mp3Bucket = new GridFSBucket(db, { bucketName: "mp3s" });
        consume(videosBucket, mp3Bucket);
      }
    });
  }
});

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));

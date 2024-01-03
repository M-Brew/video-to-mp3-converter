const { Readable } = require("stream");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const { ObjectId } = require("mongodb");
require("dotenv").config();
const { VIDEO_QUEUE } = process.env;

const uploadToGridFs = async (file, bucket, channel, user) => {
  const fileId = new ObjectId();
  const fileName = `${uuidv4()}${path.extname(file.originalname)}`;

  try {
    await Readable.from(file.buffer).pipe(
      bucket.openUploadStreamWithId(fileId, fileName)
    );

    const message = {
      videoId: fileId,
      mp3Id: null,
      userId: user.email,
    };

    await channel.assertQueue(VIDEO_QUEUE, { durable: true });
    channel.sendToQueue(VIDEO_QUEUE, Buffer.from(JSON.stringify(message)));
  } catch (error) {
    await bucket.delete(fileId);
    return error;
  }
};

module.exports = { uploadToGridFs };

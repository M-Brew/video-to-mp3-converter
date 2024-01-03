const fs = require("fs");
const crypto = require("crypto");
const ffmpeg = require("fluent-ffmpeg");
const { ObjectId } = require("mongodb");
const { MP3_QUEUE } = process.env;

async function toMP3(message, videosBucket, mp3Bucket, channel) {
  try {
    const exists = await videosBucket
      .find({ _id: new ObjectId(message.videoId) })
      .toArray();
    if (!exists || exists.length < 1) {
      return Error("File not found");
    }

    await videosBucket
      .openDownloadStream(new ObjectId(message.videoId))
      .pipe(fs.createWriteStream("./utils/temp_vid.mp4"));

    // create audio from temporal video file
    const proc = ffmpeg({ source: "./utils/temp_vid.mp4" });
    proc.setFfmpegPath("/usr/bin/ffmpeg");
    proc
      .outputOptions("-ab", "192k")
      .toFormat("mp3")
      .saveToFile("./utils/temp_mp3.mp3")
      .on("end", async () => {
        // delete temporal video file
        fs.unlinkSync("./utils/temp_vid.mp4");

        // stream audio data into a temporal mp3 file
        const mp3FileId = new ObjectId();
        const mp3FileName = crypto.randomBytes(12).toString("hex");
        await fs
          .createReadStream("./utils/temp_mp3.mp3")
          .pipe(mp3Bucket.openUploadStreamWithId(mp3FileId, mp3FileName));

        // delete temporal mp3 file
        fs.unlinkSync("./utils/temp_mp3.mp3");

        // update mp3Id on message object
        message.mp3Id = mp3FileId.toString();
        console.log({ message });

        // publish to mp3 queue
        try {
          await channel.assertQueue(MP3_QUEUE, { durable: true });
          channel.sendToQueue(MP3_QUEUE, Buffer.from(JSON.stringify(message)));
        } catch (error) {
          mp3Bucket.delete(mp3FileId);
        }
      })
      .on("error", (error) => {
        console.log(error);
        return error;
      });
  } catch (error) {
    console.log(error);
    return error;
  }
}

module.exports = { toMP3 };

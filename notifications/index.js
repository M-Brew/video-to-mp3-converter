const express = require("express");
const cors = require("cors");
const amqp = require("amqplib");
require("dotenv").config();

const { sendNotification } = require("./utils/sendNotification");
const { PORT, RABBIT_SERVICE, MP3_QUEUE } = process.env;

const app = express();

app.use(cors());

async function consume() {
  // amqp connection
  const amqpConnection = await amqp.connect({
    hostname: RABBIT_SERVICE,
    port: 5672,
    username: "guest",
    password: "guest",
  });
  const channel = await amqpConnection.createChannel();

  const callback = async (message) => {
    const error = await sendNotification(message.content.toString());
    if (error) {
      console.log({ error });
      channel.nack(message);
    } else {
      channel.ack(message);
    }
  };

  await channel.assertQueue(MP3_QUEUE);
  channel.consume(MP3_QUEUE, callback);
}

consume();

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));

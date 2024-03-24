const express = require('express');
const amqp = require('amqplib');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
const rabbitmqHost = 'rabbitmq';
//const rabbitmqUrl = "amqp://rabbitmq:5672";
const port = 4001;
app.use(bodyParser.urlencoded({ extended: false }));

async function start() {
    try {
      await connectToRabbitMQ();
      app.listen(port, () => {
        console.log(`Provider-app listening at http://localhost:${port}`);
      });
    } catch (error) {
      console.error('Error starting Provider App:', error);
    }
  }
  async function connectToRabbitMQ() {
    try {
      const connection = await amqp.connect(`amqp://${rabbitmqHost}`);
      const channel = await connection.createChannel();
      await channel.assertQueue('k8s_queue', { durable: true });
      console.log('Connected to RabbitMQ');
    } catch (error) {
      console.error('Error connecting to RabbitMQ:', error);
      throw error;
    }
  }
  start();
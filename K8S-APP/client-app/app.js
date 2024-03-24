const express = require("express");
const mysql = require("mysql2");
const amqp = require('amqplib');
const bodyParser = require('body-parser'); //express could not handle it so I used body-parser.
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
const rabbitmqHost = 'rabbitmq'; // Docker Compose service name!!!!
const rabbitmqUrl = "amqp://rabbitmq:5672";
const port = 4002;
app.use(express.json());
const connection = mysql.createPool({
    connectionLimit: 100,
    host: "mysql-service",
    user: "root",
    password: "12345678",
    database: "devopsakademi",
  });
connection.getConnection((err, connection) => {
    if (err) {
      console.log("Database connection error: ", err);
    } else {
      console.log("Database connected");
    }
});
async function start() {
    try {
        await connectToRabbitMQ();
        app.listen(port, () => {
            console.log(`Client-app listening at http://localhost:${port}`);
        });
    } catch (error) {
        console.error('Error starting Client App:', error);
        // Exit the process or handle the error accordingly
        process.exit(1);
    }
}
async function connectToRabbitMQ() {
    try {
        const connection = await amqp.connect(rabbitmqUrl,'heartbeat=60');
        const channel = await connection.createChannel();
        await channel.assertQueue('k8s_queue', { durable: true });
        console.log('Connected to RabbitMQ');
        // Start consuming messages from the queue
        channel.consume('k8s_queue', (message) => {
            const data = JSON.parse(message.content.toString());
            console.log(data);
            handleMessage(data);
            channel.ack(message); // Acknowledge message receipt
        });
    } catch (error) {
        console.error('Error connecting to RabbitMQ:', error);
        throw error;
    }
}
async function handleMessage(data) {
    console.log('Received message from RabbitMQ:', data);
    const { text: requestBody } = data;
    if (method === "POST") {
        const { text} = requestBody;
        const client = await pool.connect();
        const insertQuery = `INSERT INTO texts (text) VALUES ($1)`;
        const values = [text];
        await client.query(insertQuery, values);
        console.log("Data inserted successfully.");
        client.release();
    } else if (method === "PUT") {
        const { id, text} = requestBody;
        const client = await pool.connect();
        const updateQuery = `UPDATE texts SET text = $1 WHERE id = $4`;
        const values = [text, id];
        await client.query(updateQuery, values);
        console.log("Data updated successfully.");
        client.release();
    }
    else if (method === "DELETE") {
        const id = parseInt(data.data);
        const client = await pool.connect();
        const deleteQuery = `DELETE FROM texts WHERE id = $1`;
        const values = [id];
        await client.query(deleteQuery, values);
        console.log("Data deleted successfully.");
        client.release();
    }else {
        console.log("");
    }
}
start();
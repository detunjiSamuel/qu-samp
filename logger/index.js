

const express = require('express')
const app = express()
const amqp = require('amqplib')

const port = 7000
const QUEUE = 'logger' 


const connect  = async () => {
    try {
        const connection = await amqp.connect('amqp://localhost')
        const channel =  await connection.createChannel();
        await  channel.assertQueue(QUEUE, {
            durable: false
        });
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", QUEUE);
        await channel.consume(QUEUE, function(msg) {
            console.log(" [x] Received %s", msg.content.toString());
        }, {
            noAck: true
        });
    }catch(e)
    {
        console.error(e.message)
    }


}

connect()

app.listen(port, () => {
  console.log(`Logger service app listening at http://localhost:${port}`)
})
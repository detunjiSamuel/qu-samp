const amqp = require('amqplib');

const connectAmpq = async queues => {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  console.info('channel is created');
  for (const queue of queues) {
    await channel.assertQueue(queue, {
      durable: false,
    });
    console.log(' [*] Waiting for messages in %s. To exit press CTRL+C', queue);
  }

  return channel;
};

export { connectAmpq };

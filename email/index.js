

const express = require('express')
const app = express()
const nodemailer =  require('nodemailer')
const amqp = require('amqplib/callback_api');
const port = 4000

const QUEUE =  'mail'

const smtp = nodemailer.createTransport({
    pool: true,
    service: "Gmail",
    auth: {
      user: "samuel.adetunji@stu.cu.edu.ng",
      pass: "",
    },
  });

const mailOptions = {
    from: 'samuel.adetunji@stu.cu.edu.ng',
    to: 'freshsam21@gmail.com', 
    subject: 'Test',
    text: 'Test Test Test'
}


amqp.connect('amqp://localhost', async function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }


        channel.assertQueue(QUEUE, {
            durable: false
        });

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", QUEUE);

        channel.consume(QUEUE, function(msg) {
            let text  =  msg.content.toString()
            console.log(" [x] Received %s", text);

            const mailOptions = {
                from: 'samuel.adetunji@stu.cu.edu.ng',
                to: 'freshsam21@gmail.com', 
                subject: text,
                text
            }
           smtp.sendMail(mailOptions, function(error, response){
                if(error){
                    console.log(error);
                }else{
                    console.info('Message was sent succuessfully')
                }
                
            });
        }, {
            noAck: true
        });
    });
});


app.listen(port, () => {
  console.log(`Email listening at http://localhost:${port}`)
})
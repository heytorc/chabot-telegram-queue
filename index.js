var amqp = require('amqplib/callback_api');
const socketio  = require('socket.io-client');
const socket = socketio(`http://localhost:3333`);

amqp.connect('amqp://localhost:5672', function (err, conn) {
    conn.createChannel( function (err, ch) {
        var channelName = 'userMessage';

        ch.assertQueue(channelName, { durable: false });
        ch.prefetch(1);
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", channelName);
        ch.consume(channelName, function (msg) {
            console.log(" [x] Received %s", msg.content.toString());

            socket.emit('queueProcessed', JSON.parse(msg.content));
            
            console.log("Socket emitido...");
            
        }, { noAck: true });
    });
});
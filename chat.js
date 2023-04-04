const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const fs = require('fs');

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

let messages = [];
let userCount = 0;

function randomnumber(max) {
    return Math.floor(Math.random() * max);
}

io.on('connection', (socket) => {
    userCount++;
    let user = "user" + randomnumber(100);

    io.emit('user_count', userCount);

    console.log(user + ' vient de se connecter au serveur');
    socket.emit('user_info', user);
    socket.emit('chat_history', messages);

    socket.on('chat_message', (msg) => {
        console.log('message de ' + user + ': ' + msg);

        let message = user + ': ' + msg;
        messages.push(message);
        io.emit('chat_emit', message);

        fs.appendFile('./save/chat.txt', message + "\n", (err) => {
            if (err) {
                console.error(err);
                return;
            }
        });
    });

    socket.on('disconnect', () => {
        userCount--;
        io.emit('user_count', userCount);
        console.log(user + ' disconnected');
    });
});

http.listen(3000, () => {
    console.log('listening on *:3000');
});

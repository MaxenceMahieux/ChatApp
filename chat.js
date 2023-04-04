const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const fs = require('fs');
const config = require('./config.json');

let currentDate = new Date();
let day = currentDate.getDate();
let month = currentDate.getMonth() + 1;
let year = currentDate.getFullYear();
let hours = currentDate.getHours();
let minutes = currentDate.getMinutes();
let seconds = currentDate.getSeconds();

let formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;
console.log(formattedDate);

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

    console.log(formattedDate + ' ' + user + ' vient de se connecter au serveur');
    socket.emit('user_info', user);
    socket.emit('chat_history', messages);

    socket.on('chat_message', (msg) => {
        console.log('message de ' + user + ': ' + msg);

        let message = formattedDate + ' ' + user + ': ' + msg;
        messages.push(message);
        io.emit('chat_emit', message);

        fs.appendFile('./save/chat.txt', formattedDate + ' ' + message + "\n", (err) => {
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

http.listen(config.port, () => {
    console.log('listening on *:' + config.port);
});

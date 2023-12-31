const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const config = require('./config.json');
const mysql = require('mysql2');

const db = mysql.createPool({
    host: 'qwy.fr',
    user: 'evan',
    password: 'qwy44*',
    database: 'chatapp',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

let currentDate = new Date();
let day = currentDate.getDate();
let month = currentDate.getMonth() + 1;
let year = currentDate.getFullYear();
let hours = currentDate.getHours();
let minutes = currentDate.getMinutes();

let formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;
console.log(formattedDate);

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

let messages = [];

db.query(`SELECT * FROM messages`, (err, msg) => {
    if (!msg[0]) return console.error("No msg found");
    let msgq = msg;
    console.log(msgq);

    msgq.forEach(arraymsg => {
        let messagep = arraymsg.username + ': ' + arraymsg.message;
        console.log(messagep);
        messages.push(messagep);
    });
    
})

let userCount = 0;

function randomnumber(max) {
    return Math.floor(Math.random() * max);
}

io.on('connection', (socket) => {
    userCount++;

    let user = "user" + randomnumber(100);

    // Envoi de l'heure toutes les 15 secondes à tous les clients connectés
    setInterval(() => {
        let now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        let time = hours + ':' + (minutes < 10 ? '0' + minutes : minutes); // Ajoute un zéro pour les minutes < 10

        io.emit('update_time', time); // Envoie la nouvelle heure à tous les clients connectés
    }, 15000); // Rafraîchissement toutes les 15 secondes (15000 ms)

    socket.on('pseudo', (msg) => {
        user = msg;
        socket.emit('user_info', user);
    });

    io.emit('user_count', userCount);
    socket.emit('chat_clear');
    console.log(formattedDate + ' ' + user + ' vient de se connecter au serveur');
    socket.emit('user_info', user);
    socket.emit('chat_history', messages);

    socket.on('chat_message', async (msg) => {
        db.query(`INSERT INTO messages (message, username) VALUES ('${msg}', '${user}')`)

        console.log('message de ' + user + ': ' + msg);

        let now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        let time = hours + ':' + (minutes < 10 ? '0' + minutes : minutes); // Obtenir l'heure actuelle pour le message

        let message = '[' + time + '] ' + user + ': ' + msg; // Utilisation de l'heure actuelle dans le message

        messages.push(message);

        io.emit('chat_emit', message);
    });

    socket.on('disconnect', () => {
        userCount--;
        io.emit('user_count', userCount);
        console.log(user + ' disconnected');
    });
});

http.listen(config.port, () => {
    console.log('listening on *: http://localhost:' + config.port);
});
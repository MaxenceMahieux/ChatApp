var socket = io();

var messageForm = document.getElementById('message-form');
var messageInput = document.getElementById('message-input');

var pseudoForm = document.getElementById('pseudo-form');
var pseudoInput = document.getElementById('pseudo-input');

var messageList = document.getElementById('message-list');

var userCount = document.getElementById('user-count');
var userInfo = document.getElementById('user-info');

pseudoForm.addEventListener('submit', function (e) {
  e.preventDefault();
  if (pseudoInput.value) {
    socket.emit('pseudo', pseudoInput.value);
  }
});

// Mettre à jour le nombre d'utilisateurs connectés
socket.on('user_count', function (count) {
  userCount.textContent = count;
});
// Votre utilisateur
socket.on('user_info', function (info) {
  userInfo.textContent = info;
});

socket.on('chat_history', function (history) {
  history.reverse(); // Inverser l'ordre des messages pour afficher le dernier en dernier

  history.forEach(function (msg) {
    var messageItem = document.createElement('li');
    messageItem.textContent = msg;
    messageList.appendChild(messageItem);
    messageItem.scrollIntoView({ behavior: 'smooth' });
  });
});

// Supprimer tous les éléments du messageList
socket.on('chat_clear', function () {

});

// Ajouter les nouveaux messages en bas de la liste des messages affichés
socket.on('chat_emit', function (msg) {
  var messageItem = document.createElement('li');
  messageItem.textContent = msg;
  messageList.appendChild(messageItem);

  // Faire défiler vers le bas pour afficher le nouveau message
  messageItem.scrollIntoView({ behavior: 'smooth' });
});

messageForm.addEventListener('submit', function (e) {
  e.preventDefault();
  if (messageInput.value) {
    socket.emit('chat_message', messageInput.value);
    messageInput.value = '';
  }
});
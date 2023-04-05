var socket = io();

var messageForm = document.getElementById('message-form');
var messageInput = document.getElementById('message-input');

var pseudoForm = document.getElementById('pseudo-form');
var pseudoInput = document.getElementById('pseudo-input');

var messageList = document.getElementById('message-list');

var userCount = document.getElementById('user-count');
var userInfo = document.getElementById('user-info');

pseudoForm.addEventListener('submit', function(e) {
  e.preventDefault();
  if (pseudoInput.value) {
    socket.emit('pseudo', pseudoInput.value);
  }
});

// Mettre à jour le nombre d'utilisateurs connectés

socket.on('user_count', function(count) {
  userCount.textContent = count + ' utilisateur(s) connecté(s)';
});
// Votre utilisateur
socket.on('user_info', function(info) {
  userInfo.textContent = info;
});

// Récupérer l'historique des messages lors du chargement de la page
socket.on('chat_history', function(history) {
  history.forEach(function(msg) {
    var messageItem = document.createElement('li');
    messageItem.textContent = msg;
    messageList.insertBefore(messageItem, messageList.firstChild);
  });
});

// Ajouter les nouveaux messages en haut de la liste des messages affichés
socket.on('chat_emit', function(msg) {
  var messageItem = document.createElement('li');
  messageItem.textContent = msg;
  messageList.insertBefore(messageItem, messageList.firstChild);
});

messageForm.addEventListener('submit', function(e) {
  e.preventDefault();
  if (messageInput.value) {
    socket.emit('chat_message', messageInput.value);
    messageInput.value = '';
  }
});

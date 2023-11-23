const ioClient = require('socket.io-client');
const config = require('../config.json');

// Fonction utilitaire pour créer un client Socket.IO pour les tests
function createSocketClient() {
    return ioClient(`http://localhost:${config.port}`);
}

// Test de validation du nom d'utilisateur lors de l'envoi d'un message
describe('Intégration du pseudonyme choisi', () => {
    let socket;

    beforeAll(() => {
        // Connexion au serveur Socket.IO avant chaque test
        socket = createSocketClient();
    });

    afterAll(() => {
        // Déconnexion du serveur Socket.IO après chaque test
        socket.disconnect();
    });

    it('', (done) => {
        const testUsername = 'testUser';
        const testMessage = 'This is a test message';

        // Émettre l'événement 'pseudo' pour envoyer le nom d'utilisateur au serveur
        socket.emit('pseudo', testUsername);

        // Écouter l'événement 'chat_emit' émis par le serveur
        socket.on('chat_emit', (message) => {
            // Vérifier si le message contient le nom d'utilisateur attendu
            expect(message).toMatch(new RegExp(`^${testUsername}: ${testMessage}$`));
            done();
        });

        // Émettre un message au serveur après avoir reçu le nom d'utilisateur
        socket.emit('chat_message', testMessage);
    });
});

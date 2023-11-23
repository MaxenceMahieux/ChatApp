const mysql = require('mysql2');

// Création d'une connexion à la base de données pour les tests
const db = mysql.createPool({
    host: 'qwy.fr',
    user: 'evan',
    password: 'qwy44*',
    database: 'chatapp', // Utilisation d'une base de données de test
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

describe('Envoi d\'un message dans le chat', () => {
    it('', async () => {
        // Message à insérer dans la base de données
        const testMessage = 'Ceci est un message de test';
        const testUser = 'testUser';

        // Insertion du message dans la base de données
        await new Promise((resolve, reject) => {
            db.query(`INSERT INTO messages (message, username) VALUES (?, ?)`, [testMessage, testUser], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

        // Vérification que le message a été inséré correctement
        const insertedMessages = await new Promise((resolve, reject) => {
            db.query('SELECT * FROM messages WHERE message = ? AND username = ?', [testMessage, testUser], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });

        expect(insertedMessages.length).toBeGreaterThan(0);

        // Suppression du message de la base de données
        await new Promise((resolve, reject) => {
            db.query('DELETE FROM messages WHERE message = ? AND username = ?', [testMessage, testUser], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

        // Vérification que le message a été supprimé avec succès
        const deletedMessages = await new Promise((resolve, reject) => {
            db.query('SELECT * FROM messages WHERE message = ? AND username = ?', [testMessage, testUser], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });

        expect(deletedMessages.length).toBe(0);
    });
});

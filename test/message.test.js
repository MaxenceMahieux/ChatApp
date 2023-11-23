const mysql = require('mysql2');
const databaseConfig = require('../config/databaseConfig.json');

// Création d'une connexion à la base de données pour les tests en utilisant les informations exportées
const db = mysql.createPool(databaseConfig);

describe('Envoi d\'un message dans le chat', () => {
    it('', async () => {
        // Message à insérer dans la base de données
        const testMessage = 'Ceci est un message de test';
        const testUser = 'testUser';

        // Insertion du message dans la base de données
        await new Promise((resolve, reject) => {
            db.query(`INSERT INTO messages (id) VALUES (?)`, ["123456789"], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

        // Vérification que le message a été inséré correctement
        const insertedMessages = await new Promise((resolve, reject) => {
            db.query('SELECT * FROM messages WHERE id = ?', ["123456789"], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });

        // Suppression du message de la base de données
        await new Promise((resolve, reject) => {
            db.query('DELETE FROM messages WHERE id = ?', ["123456789"], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

        // Vérification que le message a été supprimé avec succès
        const deletedMessages = await new Promise((resolve, reject) => {
            db.query('SELECT * FROM messages WHERE id = ?', ["123456789"], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    });
});
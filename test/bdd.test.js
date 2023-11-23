const mysql = require('mysql2');
const databaseConfig = require('../config/databaseConfig.json');

function createDBPool() {
    return mysql.createPool(databaseConfig);
}

jest.mock('mysql2', () => ({
    createPool: jest.fn(() => ({
        getConnection: jest.fn((callback) => {
            const mockConnection = {
                // Simuler la méthode release pour la libération de la connexion
                release: jest.fn(),
            };
            callback(null, mockConnection);
        }),
        end: jest.fn() // Fonction de fin simulée
    }))
}));

describe('Connexion à la base de donnée', () => {
    it('should successfully connect to the database', async () => {
        const db = createDBPool();

        expect(mysql.createPool).toHaveBeenCalledWith(databaseConfig);

        const connection = await new Promise((resolve) => {
            db.getConnection((err, conn) => {
                resolve(conn);
            });
        });

        expect(connection).toBeTruthy();

        connection.release(); // Maintenant, la méthode release est simulée dans le mock
        db.end();
    });
});

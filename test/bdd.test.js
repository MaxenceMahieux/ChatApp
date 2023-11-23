const mysql = require('mysql2');

function createDBPool() {
    return mysql.createPool({
        host: 'qwy.fr',
        user: 'evan',
        password: 'qwy44*',
        database: 'chatapp',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });
}

jest.mock('mysql2', () => ({
    createPool: jest.fn(() => ({
        getConnection: jest.fn((callback) => {
            const mockConnection = {
                // Simuler la méthode release pour la libération de la connexion
                release: jest.fn(),
                // Autres méthodes ou fonctionnalités que vous pourriez utiliser
                // ...
            };
            callback(null, mockConnection);
        }),
        end: jest.fn() // Fonction de fin simulée
    }))
}));

describe('Connexion à la base de donnée', () => {
    it('', async () => {
        const db = createDBPool();

        expect(mysql.createPool).toHaveBeenCalledWith({
            host: 'qwy.fr',
            user: 'evan',
            password: 'qwy44*',
            database: 'chatapp',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

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

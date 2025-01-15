const Database = require('better-sqlite3');
const path = require('path');

class DatabaseManager {
    constructor() {
        this.db = new Database(path.join(__dirname, '../../data/api-docs.db'));
        this.initializeDatabase();
    }

    initializeDatabase() {
        const createTablesQuery = `
            CREATE TABLE IF NOT EXISTS specs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                file_name TEXT NOT NULL,
                yaml_content TEXT NOT NULL,
                description TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `;

        this.db.exec('PRAGMA foreign_keys = ON');
        this.db.exec(createTablesQuery);
    }

    close() {
        this.db.close();
    }
}

// Singleton instance
let instance = null;

module.exports = {
    getInstance: () => {
        if (!instance) {
            instance = new DatabaseManager();
        }
        return instance.db;
    }
}; 
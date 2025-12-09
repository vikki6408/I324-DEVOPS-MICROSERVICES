const sqlite3 = require('sqlite3').verbose();
const path = require('path');

let db;

function connectDb() {
    return new Promise((resolve, reject) => {
        const dbFile = process.env.NODE_ENV === 'test' ? ':memory:' : path.join(__dirname, '..', 'customers.sqlite');
        db = new sqlite3.Database(dbFile, (err) => {
            if (err) return reject(err);
            resolve(db);
        });
    });
}

function getDb() {
    if (!db) {
        throw new Error("Database not initialized. Call connectDb() first.");
    }
    return db;
}

function initDb() {
    return new Promise((resolve, reject) => {
        const initSql = `
            PRAGMA foreign_keys = ON;

            CREATE TABLE IF NOT EXISTS customers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                firstname TEXT NOT NULL,
                phoneNumber TEXT NOT NULL,
                emailAddress TEXT NOT NULL,
                created_at TEXT DEFAULT (datetime('now')),
                updated_at TEXT DEFAULT (datetime('now'))
            );

            CREATE TABLE IF NOT EXISTS reservations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                customer_id INTEGER NOT NULL,
                product_id INTEGER NOT NULL,
                quantity INTEGER NOT NULL DEFAULT 1,
                created_at TEXT DEFAULT (datetime('now')),
                updated_at TEXT DEFAULT (datetime('now')),
                FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
            );
        `;
        db.exec(initSql, (err) => {
            if (err) return reject(err);
            resolve();
        });
    });
}

function seedDb() {
    return new Promise((resolve, reject) => {
        const db = getDb();
        db.serialize(() => {
            const customers = [
                ['Davis', 'Elijah', '+1-944-867-1271', 'elijah.davis@mail.com'],
                ['Harris', 'Hannah', '+1-692-603-8405', 'hannah.harris@testmail.org'],
                ['Jackson', 'Sophia', '+1-784-336-8217', 'sophia.jackson@mail.com'],
                ['Anderson', 'Emma', '+1-620-679-4966', 'emma.anderson@testmail.org']
            ];

            const insertCustomer = db.prepare(`
                INSERT INTO customers (name, firstname, phoneNumber, emailAddress)
                VALUES (?, ?, ?, ?)
            `);

            customers.forEach(c => insertCustomer.run(c));
            insertCustomer.finalize(err => {
                if (err) return reject(err);

                const reservations = [
                    [1, 1, 2],
                    [2, 10, 3],
                    [3, 5, 1],
                    [4, 11, 1]
                ];

                const insertReservation = db.prepare(`
                    INSERT INTO reservations (customer_id, product_id, quantity)
                    VALUES (?, ?, ?)
                `);
                reservations.forEach(r => insertReservation.run(r));
                insertReservation.finalize(err2 => {
                    if (err2) return reject(err2);
                    resolve();
                });
            });
        });
    });
}

function closeDb() {
    return new Promise((resolve, reject) => {
        if (!db) return resolve();
        db.close(err => {
            if (err) return reject(err);
            resolve();
        });
    });
}

module.exports = { connectDb, getDb, initDb, seedDb, closeDb };

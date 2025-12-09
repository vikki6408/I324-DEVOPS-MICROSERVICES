const { getDb } = require('../config/database');

const Customer = {
    findAll() {
        const db = getDb();
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM customers', (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    },

    findById(id) {
        const db = getDb();
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM customers WHERE id = ?', [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }
};

module.exports = Customer;

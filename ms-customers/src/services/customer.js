const CustomerEntity = require('../entities/Customer');

const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3000';

const Customer = {
    async getAll() {
        return CustomerEntity.findAll();
    },

    async getById(id) {
        return CustomerEntity.findById(id);
    },

    async create(customer) {
        return CustomerEntity.insert(customer);
    },

    //TODO Task 002 - Missing implementation
    /*async update() {
    },*/

    async delete(id) {
        const existing = await CustomerEntity.findById(id);
        if (!existing) return null;

        return CustomerEntity.delete(id);
    },

    async getCustomerWithReservations(customerId) {
        const customer = await CustomerEntity.findById(customerId);
        if (!customer) throw new Error('Customer not found');

        const reservations = await CustomerEntity.findReservations(customerId);

        const items = await Promise.all(
            reservations.map(async (productId) => {
                const res = await fetch(`${PRODUCT_SERVICE_URL}/api/v1/products/${productId}`);
                if (!res.ok) throw new Error(`Product ${productId} not found`);
                const itemData = await res.json();
                return { ...itemData};
            })
        );

        return { ...customer, items };
    },

    async addReservation(customer_id, product_id, quantity) {
        const response = await fetch(`${PRODUCT_SERVICE_URL}/api/v1/products/${product_id}`);
        if (!response.ok) throw new Error('Invalid product ID');

        return CustomerEntity.insertReservation(customer_id, product_id, quantity);
    },

    async getReservations(customerId) {
        return CustomerEntity.findReservations(customerId);
    },

    async deleteReservations(id) {
        const existing = await CustomerEntity.findReservations(id);
        if (!existing) return null;

        return CustomerEntity.deleteReservation(id);
    }
};

module.exports = Customer;
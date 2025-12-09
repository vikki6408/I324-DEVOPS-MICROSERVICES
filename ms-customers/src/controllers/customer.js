const { validationResult } = require('express-validator');
const CustomerService = require('../services/customer');

const Customer = {
    async findAll(req, res) {
        try {
            const customers = await CustomerService.getAll();
            res.json(customers);
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    },

    async findOne(req, res) {
        try {
            const customer = await CustomerService.getById(req.params.id);
            if (!customer) return res.status(404).json({error: 'Customer not found'});
            res.json(customer);
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    },

    async create(req, res) {
        try {
            const customer = await CustomerService.create(req.body);
            res.status(201).json(customer);
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    },

    async update(req, res) {
        try {
            const {id} = req.params;
            const updatedCustomer = await CustomerService.update(id, req.body);
            if (!updatedCustomer) return res.status(404).json({error: 'Customer not found'});
            res.json(updatedCustomer);
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    },

    async delete(req, res) {
        try {
            const {id} = req.params;
            const deleted = await CustomerService.delete(id);
            if (!deleted) return res.status(404).json({error: 'Customer not found'});
            res.status(204).send(); // 204 No Content
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    },

    async addReservation(req, res) {
        try {
            const {id} = req.params;
            const {product_id, quantity} = req.body;
            const reservation = await CustomerService.addReservation(id, product_id, quantity);
            res.status(201).json(reservation);
        } catch (error) {
            res.status(400).json({error: error.message});
        }
    },

    //TODO Task 003 - Missing implementation
    async getReservations(req, res) {
        res.status(500).json({error: error.message});
    },

    async deleteReservations(req, res) {
        try {
            const { id } = req.params;
            const deleted = await CustomerService.deleteReservations(id);
            if (!deleted) return res.status(404).json({ error: 'Reservation not found' });
            res.status(204).send(); // 204 No Content
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = Customer;

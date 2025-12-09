const express = require('express');
const { body, param } = require('express-validator');
const customerController = require('../controllers/customer');

const router = express.Router();

/**
 * @openapi
 * /api/v1/customers:
 *   get:
 *     summary: Retrieve a list of customers
 *     responses:
 *       200:
 *         description: A list of customers
 *   post:
 *     summary: Create a new customer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - firstname
 *               - phoneNumber
 *               - emailAddress
 *             properties:
 *               name:
 *                 type: string
 *               firstname:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               emailAddress:
 *                 type: string
 *     responses:
 *       201:
 *         description: Customer created
 *       400:
 *         description: Invalid input
 */

/**
 * @openapi
 * /api/v1/customers/{id}:
 *   get:
 *     summary: Get a customer by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single customer
 *       404:
 *         description: Customer not found
 *   put:
 *     summary: Update a customer by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - firstname
 *               - phoneNumber
 *               - emailAddress
 *             properties:
 *               name:
 *                 type: string
 *               firstname:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               emailAddress:
 *                 type: string
 *     responses:
 *       200:
 *         description: Customer updated
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Customer not found
 *   delete:
 *     summary: Delete a customer by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Customer deleted
 *       404:
 *         description: Customer not found
 */

/**
 * @openapi
 * /api/v1/customers/{id}/reservations:
 *   get:
 *     summary: Retrieve all reservation lines for a specific customer
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of reservation lines for the customer
 *   post:
 *     summary: Add a new reservation line for a specific customer
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product_id
 *               - quantity
 *             properties:
 *               product_id:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Reservation line created
 *       400:
 *         description: Invalid input
 *
 * /api/v1/customers/{id}/reservations/{reservationId}:
 *   delete:
 *     summary: Delete a reservation line by ID for a specific customer
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: reservationId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Reservation deleted
 *       404:
 *         description: Reservation not found
 */

/**
 * Validation rules
 */
const createAndUpdateValidationsCustomer = [
    body('name').isString().notEmpty().withMessage('name is required'),
    body('firstname').isString().notEmpty().withMessage('firstname is required'),
    body('phoneNumber').isString().notEmpty().withMessage('phoneNumber is required'),
    body('emailAddress').isString().notEmpty().withMessage('emailAddress is required')
];

const createAndUpdateValidationsReservations = [
    param('id').isInt().withMessage('customer id must be an integer'),
    body('product_id').isInt().withMessage('product_id must be an integer'),
    body('quantity').isInt({ min: 1 }).withMessage('quantity must be a positive integer'),
];

router.get('/', customerController.findAll);
router.post('/', createAndUpdateValidationsCustomer, customerController.create);
router.get('/:id', [param('id').isInt()], customerController.findOne);
router.put('/:id', [param('id').isInt(), createAndUpdateValidationsCustomer], customerController.update);
router.delete('/:id', [param('id').isInt()], customerController.delete);

// --- Reservation routes ---
router.get('/:id/reservations', [param('id').isInt()], customerController.getReservations);
router.post('/:id/reservations', createAndUpdateValidationsCustomer, customerController.addReservation);
router.delete('/:id/reservations/:reservationId', [
    param('id').isInt(),
    param('reservationId').isInt()
], customerController.deleteReservations);

module.exports = router;

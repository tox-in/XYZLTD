const express = require('express');
const router = express.Router();
const carEntryController = require('../controllers/carEntryController');
const { authenticate } = require('../middleware/auth');
const { checkRole } = require('../middleware/roleCheck');
const { validate, carEntrySchemas } = require('../utils/validators');

/**
 * @swagger
 * /api/car-entries:
 *   post:
 *     summary: Register car entry
 *     tags: [Car Entries]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - plateNumber
 *               - parkingId
 *             properties:
 *               plateNumber:
 *                 type: string
 *                 description: Car plate number
 *               parkingId:
 *                 type: string
 *                 description: ID of the parking
 *     responses:
 *       201:
 *         description: Car entry registered successfully
 *       400:
 *         description: Invalid request parameters
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/', authenticate, checkRole(['admin', 'attendant']), validate(carEntrySchemas.create), carEntryController.registerCarEntry);

/**
 * @swagger
 * /api/car-entries:
 *   get:
 *     summary: Get all car entries
 *     tags: [Car Entries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: plateNumber
 *         schema:
 *           type: string
 *         description: Filter by plate number
 *       - in: query
 *         name: parkingId
 *         schema:
 *           type: string
 *         description: Filter by parking ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, completed]
 *         description: Filter by status (active/completed)
 *     responses:
 *       200:
 *         description: Car entries retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/', authenticate, checkRole(['admin', 'attendant']), carEntryController.getAllCarEntries);

/**
 * @swagger
 * /api/car-entries/{id}:
 *   get:
 *     summary: Get car entry by ID
 *     tags: [Car Entries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Car entry ID
 *     responses:
 *       200:
 *         description: Car entry retrieved successfully
 *       404:
 *         description: Car entry not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/:id', authenticate, checkRole(['admin', 'attendant']), carEntryController.getCarEntryById);

/**
 * @swagger
 * /api/car-entries/{carEntryId}/exit:
 *   put:
 *     summary: Register car exit
 *     tags: [Car Entries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: carEntryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Car entry ID
 *     responses:
 *       200:
 *         description: Car exit registered successfully
 *       400:
 *         description: Invalid request or car has already exited
 *       404:
 *         description: Car entry not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.put('/:carEntryId/exit', authenticate, checkRole(['admin', 'attendant']), validate(carEntrySchemas.update), carEntryController.registerCarExit);

/**
 * @swagger
 * /api/car-entries/{carEntryId}/bill:
 *   get:
 *     summary: Generate bill for car entry
 *     tags: [Car Entries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: carEntryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Car entry ID
 *     responses:
 *       200:
 *         description: Bill generated successfully
 *       400:
 *         description: Car has not exited yet
 *       404:
 *         description: Car entry not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/:carEntryId/bill', authenticate, checkRole(['admin', 'attendant']), carEntryController.generateBill);

module.exports = router;
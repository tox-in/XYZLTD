const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const { authenticate } = require('../middleware/auth');
const { checkRole } = require('../middleware/roleCheck');

/**
 * @swagger
 * /api/tickets:
 *   post:
 *     summary: Generate ticket for a car entry
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - carEntryId
 *             properties:
 *               carEntryId:
 *                 type: string
 *                 description: ID of the car entry
 *     responses:
 *       201:
 *         description: Ticket generated successfully
 *       400:
 *         description: Invalid request parameters or ticket already exists
 *       404:
 *         description: Car entry not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/', authenticate, checkRole(['admin', 'attendant']), ticketController.generateTicket);

/**
 * @swagger
 * /api/tickets/{id}:
 *   get:
 *     summary: Get ticket by ID
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Ticket ID
 *     responses:
 *       200:
 *         description: Ticket retrieved successfully
 *       404:
 *         description: Ticket not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/:id', authenticate, checkRole(['admin', 'attendant']), ticketController.getTicketById);

/**
 * @swagger
 * /api/tickets/number/{ticketNumber}:
 *   get:
 *     summary: Get ticket by ticket number
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ticketNumber
 *         required: true
 *         schema:
 *           type: string
 *         description: Ticket number
 *     responses:
 *       200:
 *         description: Ticket retrieved successfully
 *       404:
 *         description: Ticket not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/number/:ticketNumber', authenticate, checkRole(['admin', 'attendant']), ticketController.getTicketByNumber);

module.exports = router;
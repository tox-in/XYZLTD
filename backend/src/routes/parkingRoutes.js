const express = require('express');
const router = express.Router();
const parkingController = require('../controllers/parkingController');
const { validate, parkingSchemas } = require('../utils/validators');
const { authenticate } = require('../middleware/auth');
const { checkRole } = require('../middleware/roleCheck');

/**
 * @swagger
 * /api/parkings:
 *   post:
 *     summary: Create a new parking
 *     tags: [Parkings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - name
 *               - totalSpaces
 *               - location
 *               - hourlyRate
 *             properties:
 *               code:
 *                 type: string
 *                 description: Unique code for the parking
 *               name:
 *                 type: string
 *                 description: Name of the parking
 *               totalSpaces:
 *                 type: integer
 *                 description: Total number of parking spaces
 *               location:
 *                 type: string
 *                 description: Location of the parking
 *               hourlyRate:
 *                 type: number
 *                 description: Hourly rate for the parking
 *     responses:
 *       201:
 *         description: Parking created successfully
 *       400:
 *         description: Invalid request parameters
 *       409:
 *         description: Parking with this code already exists
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/', 
  authenticate, 
  checkRole(['ADMIN']), 
  validate(parkingSchemas.create), 
  parkingController.createParking
);

/**
 * @swagger
 * /api/parkings:
 *   get:
 *     summary: Get all parkings with pagination
 *     tags: [Parkings]
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
 *     responses:
 *       200:
 *         description: Parkings retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/', 
  authenticate, 
  parkingController.getAllParkings
);

/**
 * @swagger
 * /api/parkings/{id}:
 *   get:
 *     summary: Get parking by ID
 *     tags: [Parkings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Parking ID
 *     responses:
 *       200:
 *         description: Parking retrieved successfully
 *       404:
 *         description: Parking not found
 *       401:
 *         description: Unauthorized
 */
router.get('/:id', 
  authenticate, 
  validate(parkingSchemas.getById), 
  parkingController.getParkingById
);

/**
 * @swagger
 * /api/parkings/{id}:
 *   put:
 *     summary: Update parking
 *     tags: [Parkings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Parking ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 description: Unique code for the parking
 *               name:
 *                 type: string
 *                 description: Name of the parking
 *               totalSpaces:
 *                 type: integer
 *                 description: Total number of parking spaces
 *               location:
 *                 type: string
 *                 description: Location of the parking
 *               hourlyRate:
 *                 type: number
 *                 description: Hourly rate for the parking
 *     responses:
 *       200:
 *         description: Parking updated successfully
 *       400:
 *         description: Invalid request parameters
 *       404:
 *         description: Parking not found
 *       409:
 *         description: Parking code is already in use
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.put('/:id', 
  authenticate, 
  checkRole(['ADMIN']), 
  validate(parkingSchemas.update), 
  parkingController.updateParking
);

/**
 * @swagger
 * /api/parkings/{id}:
 *   delete:
 *     summary: Delete parking
 *     tags: [Parkings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Parking ID
 *     responses:
 *       200:
 *         description: Parking deleted successfully
 *       400:
 *         description: Cannot delete parking with active car entries
 *       404:
 *         description: Parking not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.delete('/:id', 
  authenticate, 
  checkRole(['ADMIN']), 
  validate(parkingSchemas.getById), 
  parkingController.deleteParking
);

module.exports = router;
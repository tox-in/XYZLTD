const express = require('express');
const router = express.Router();
const {register, login} = require('../controllers/authController');
const { validate, userSchemas } = require('../utils/validators');

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: User's first name
 *               lastName:
 *                 type: string
 *                 description: User's last name
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: User's password (min 8 characters)
 *               role:
 *                 type: string
 *                 enum: [USER, ADMIN, ATTENDANT]
 *                 default: USER
 *                 description: User's role
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid request parameters
 *       409:
 *         description: User with this email already exists
 */
router.post('/register',validate(userSchemas.register), register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Invalid request parameters
 *       401:
 *         description: Invalid email or password
 */

router.post('/login',validate(userSchemas.login), login);

module.exports = router;
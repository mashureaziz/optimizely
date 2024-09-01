import { Router } from 'express';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import {
    getTVSeries,
    addTVSeries,
    updateTVSeries,
    deleteTVSeries,
    tvSeriesValidationRules
} from '../controllers/tvSeriesController';
import {
    getSeasons,
    addSeason,
    updateSeason,
    deleteSeason
} from '../controllers/seasonController';
import {
    getEpisodes,
    addEpisode,
    updateEpisode,
    deleteEpisode
} from '../controllers/episodeController';
import {
    getPayments,
    addPayment,
    updatePayment,
    deletePayment
} from '../controllers/paymentController';
import authMiddleware from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     UserIdHeader:
 *       type: apiKey
 *       in: header
 *       name: x-user-id
 *   schemas:
 *     TVSeries:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           example: "Breaking Bad"
 *         description:
 *           type: string
 *           example: "A high school chemistry teacher turned methamphetamine manufacturer."
 *     Season:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           example: "Season 1"
 *         tvSeriesId:
 *           type: string
 *           example: "60d21b4667d0d8992e610c85"
 *         userIds:
 *           type: array
 *           items:
 *             type: string
 *             example: "60d21b4667d0d8992e610c88"
 *     Episode:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           example: "Pilot"
 *         seasonId:
 *           type: string
 *           example: "60d21b4667d0d8992e610c86"
 *     Payment:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           example: "60d21b4667d0d8992e610c87"
 *         seasonId:
 *           type: string
 *           example: "60d21b4667d0d8992e610c86"
 *         amount:
 *           type: number
 *           example: 9.99
 *         date:
 *           type: string
 *           format: date-time
 *           example: "2023-10-01T14:48:00.000Z"
 */

/**
 * @swagger
 * tags:
 *   name: TVSeries
 *   description: TV Series management
 */

/**
 * @swagger
 * /tvseries:
 *   get:
 *     summary: Get all TV series
 *     tags: [TVSeries]
 *     security:
 *       - UserIdHeader: []
 *     responses:
 *       200:
 *         description: A list of TV series
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TVSeries'
 */
router.get('/tvseries', getTVSeries);

/**
 * @swagger
 * /tvseries:
 *   post:
 *     summary: Add a new TV series
 *     tags: [TVSeries]
 *     security:
 *       - UserIdHeader: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TVSeries'
 *     responses:
 *       200:
 *         description: The created TV series
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TVSeries'
 */
router.post('/tvseries', authMiddleware, tvSeriesValidationRules(), addTVSeries);

/**
 * @swagger
 * /tvseries/{id}:
 *   put:
 *     summary: Update a TV series
 *     tags: [TVSeries]
 *     security:
 *       - UserIdHeader: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the TV series to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TVSeries'
 *     responses:
 *       200:
 *         description: The updated TV series
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TVSeries'
 */
router.put('/tvseries/:id', authMiddleware, tvSeriesValidationRules(), updateTVSeries);

/**
 * @swagger
 * /tvseries/{id}:
 *   delete:
 *     summary: Delete a TV series
 *     tags: [TVSeries]
 *     security:
 *       - UserIdHeader: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the TV series to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: TV series deleted successfully
 */
router.delete('/tvseries/:id', authMiddleware, deleteTVSeries);

/**
 * @swagger
 * tags:
 *   name: Seasons
 *   description: Season management
 */

/**
 * @swagger
 * /seasons/{tvSeriesId}:
 *   get:
 *     summary: Get all seasons for a TV series
 *     tags: [Seasons]
 *     security:
 *       - UserIdHeader: []
 *     parameters:
 *       - in: path
 *         name: tvSeriesId
 *         required: true
 *         description: The ID of the TV series
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of seasons
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Season'
 */
router.get('/seasons/:tvSeriesId', getSeasons);

/**
 * @swagger
 * /seasons:
 *   post:
 *     summary: Add a new season
 *     tags: [Seasons]
 *     security:
 *       - UserIdHeader: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Season'
 *     responses:
 *       200:
 *         description: The created season
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Season'
 */
router.post('/seasons', authMiddleware, addSeason);

/**
 * @swagger
 * /seasons/{id}:
 *   put:
 *     summary: Update a season
 *     tags: [Seasons]
 *     security:
 *       - UserIdHeader: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the season to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Season'
 *     responses:
 *       200:
 *         description: The updated season
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Season'
 */
router.put('/seasons/:id', authMiddleware, updateSeason);

/**
 * @swagger
 * /seasons/{id}:
 *   delete:
 *     summary: Delete a season
 *     tags: [Seasons]
 *     security:
 *       - UserIdHeader: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the season to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Season deleted successfully
 */
router.delete('/seasons/:id', authMiddleware, deleteSeason);

/**
 * @swagger
 * tags:
 *   name: Episodes
 *   description: Episode management
 */

/**
 * @swagger
 * /episodes/{seasonId}:
 *   get:
 *     summary: Get all episodes for a season
 *     tags: [Episodes]
 *     security:
 *       - UserIdHeader: []
 *     parameters:
 *       - in: path
 *         name: seasonId
 *         required: true
 *         description: The ID of the season
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of episodes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Episode'
 */
router.get('/episodes/:seasonId', getEpisodes);

/**
 * @swagger
 * /episodes:
 *   post:
 *     summary: Add a new episode
 *     tags: [Episodes]
 *     security:
 *       - UserIdHeader: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Episode'
 *     responses:
 *       200:
 *         description: The created episode
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Episode'
 */
router.post('/episodes', authMiddleware, addEpisode);

/**
 * @swagger
 * /episodes/{id}:
 *   put:
 *     summary: Update an episode
 *     tags: [Episodes]
 *     security:
 *       - UserIdHeader: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the episode to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Episode'
 *     responses:
 *       200:
 *         description: The updated episode
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Episode'
 */
router.put('/episodes/:id', authMiddleware, updateEpisode);

/**
 * @swagger
 * /episodes/{id}:
 *   delete:
 *     summary: Delete an episode
 *     tags: [Episodes]
 *     security:
 *       - UserIdHeader: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the episode to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Episode deleted successfully
 */
router.delete('/episodes/:id', authMiddleware, deleteEpisode);

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment management
 */

/**
 * @swagger
 * /payments:
 *   get:
 *     summary: Get all payments
 *     tags: [Payments]
 *     security:
 *       - UserIdHeader: []
 *     responses:
 *       200:
 *         description: A list of payments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Payment'
 */
router.get('/payments', authMiddleware, getPayments);

/**
 * @swagger
 * /payments:
 *   post:
 *     summary: Add a new payment
 *     tags: [Payments]
 *     security:
 *       - UserIdHeader: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Payment'
 *     responses:
 *       200:
 *         description: The created payment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payment'
 */
router.post('/payments', authMiddleware, addPayment);

/**
 * @swagger
 * /payments/{id}:
 *   put:
 *     summary: Update a payment
 *     tags: [Payments]
 *     security:
 *       - UserIdHeader: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the payment to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 12.99
 *     responses:
 *       200:
 *         description: The updated payment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payment'
 */
router.put('/payments/:id', authMiddleware, updatePayment);

/**
 * @swagger
 * /payments/{id}:
 *   delete:
 *     summary: Delete a payment
 *     tags: [Payments]
 *     security:
 *       - UserIdHeader: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the payment to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Payment deleted successfully
 */
router.delete('/payments/:id', authMiddleware, deletePayment);

// Swagger setup
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'TV Show Admin Dashboard API',
            version: '1.0.0',
            description: 'API documentation for managing TV shows, seasons, episodes, and payments.',
        },
        components: {
            securitySchemes: {
                UserIdHeader: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'x-user-id',
                },
            },
        },
    },
    apis: ['./src/routes/index.ts'], // Path to the API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

export default router;

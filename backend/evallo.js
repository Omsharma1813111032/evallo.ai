const express = require('express');
const cors = require('cors');
const { readLogs, writeLogs } = require('./helpers/fileHandler');
const setupSwagger = require('./swagger');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json())
setupSwagger(app);

// Allowed log levels
const validLevels = ['error', 'warn', 'info', 'debug'];

// Helper: Validate log schema
function isValidLog(log) {
    const requiredFields = ['level', 'message', 'resourceId', 'timestamp', 'traceId', 'spanId', 'commit', 'metadata'];
    const hasAllFields = requiredFields.every(key => key in log);
    const isValidLevel = validLevels.includes(log.level);
    const isValidDate = !isNaN(Date.parse(log.timestamp));
    return hasAllFields && isValidLevel && isValidDate;
}


app.get("/", (req, res) => {
    res.send("Server is runnign!")
})


// POST /logs - Ingest a new log
/**
 * @swagger
 * /logs:
 *   post:
 *     summary: Ingest a new log
 *     tags: [Logs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - level
 *               - message
 *               - resourceId
 *               - timestamp
 *               - traceId
 *               - spanId
 *               - commit
 *               - metadata
 *             properties:
 *               level:
 *                 type: string
 *               message:
 *                 type: string
 *               resourceId:
 *                 type: string
 *               timestamp:
 *                 type: string
 *               traceId:
 *                 type: string
 *               spanId:
 *                 type: string
 *               commit:
 *                 type: string
 *               metadata:
 *                 type: object
 *     responses:
 *       201:
 *         description: Log created successfully
 *       400:
 *         description: Invalid log schema
 *       500:
 *         description: Server error
 */
app.post('/logs', (req, res) => {
    const log = req.body;

    if (!isValidLog(log)) {
        return res.status(400).json({ error: 'Invalid log schema' });
    }

    try {
        const logs = readLogs();
        logs.push(log);
        writeLogs(logs);
        return res.status(201).json(log);
    } catch (err) {
        return res.status(500).json({ error: 'Failed to save log' });
    }
});

/**
 * @swagger
 * /logs:
 *   get:
 *     summary: Get filtered and paginated logs
 *     tags: [Logs]
 *     parameters:
 *       - in: query
 *         name: level
 *         schema:
 *           type: string
 *           enum: [error, warn, info, debug]
 *         description: Filter logs by level
 *       - in: query
 *         name: message
 *         schema:
 *           type: string
 *         description: Full-text search in the log message
 *       - in: query
 *         name: resourceId
 *         schema:
 *           type: string
 *         description: Filter by resourceId
 *       - in: query
 *         name: timestamp_start
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter logs from this ISO timestamp
 *       - in: query
 *         name: timestamp_end
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter logs up to this ISO timestamp
 *       - in: query
 *         name: traceId
 *         schema:
 *           type: string
 *         description: Filter by traceId
 *       - in: query
 *         name: spanId
 *         schema:
 *           type: string
 *         description: Filter by spanId
 *       - in: query
 *         name: commit
 *         schema:
 *           type: string
 *         description: Filter by commit hash
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of logs per page
 *     responses:
 *       200:
 *         description: A list of filtered logs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 logs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Log'
 *                 total:
 *                   type: integer
 *                   description: Total number of matching logs
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *       500:
 *         description: Internal server error
 */

app.get('/logs', (req, res) => {
    try {
        let logs = readLogs();
        const {
            level,
            message,
            resourceId,
            timestamp_start,
            timestamp_end,
            traceId,
            spanId,
            commit,
            page = 1,
            limit = 10
        } = req.query;

        logs = logs.filter((log) => {
            const logTime = new Date(log.timestamp);
            const start = timestamp_start ? new Date(timestamp_start) : null;
            const end = timestamp_end ? new Date(timestamp_end) : null;

            console.log({ timestamp_start, timestamp_end, logTime, start, end });
            return (
                (!level || log.level === level) &&
                (!message || log.message.toLowerCase().includes(message.toLowerCase())) &&
                (!resourceId || log.resourceId === resourceId) &&
                (!timestamp_start || (!isNaN(start) && logTime >= start)) &&
                (!timestamp_end || (!isNaN(end) && logTime <= end)) &&
                (!traceId || log.traceId === traceId) &&
                (!spanId || log.spanId === spanId) &&
                (!commit || log.commit === commit)
            );
        });

        logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        // 🔥 Pagination logic
        const startIndex = (parseInt(page) - 1) * parseInt(limit);
        const paginatedLogs = logs.slice(startIndex, startIndex + parseInt(limit));

        return res.status(200).json({
            logs: paginatedLogs,
            total: logs.length,
            page: parseInt(page),
            limit: parseInt(limit)
        });
    } catch (err) {
        console.log("err", err)
        return res.status(500).json({ error: 'Failed to read logs' });
    }
});


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

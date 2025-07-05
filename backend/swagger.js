const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Log Ingestion and Querying API',
            version: '1.0.0',
            description: 'API documentation for the log ingestion system'
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Development server'
            }
        ]
    },
    apis: ['./evallo.js'], // Path to the API docs (can include multiple files)
};

const swaggerSpec = swaggerJSDoc(options);

const setupSwagger = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = setupSwagger;

const api = require('./api');
const apiRedirect = require('./api');
const db = require('./model');
const logger = require('./logger');

const port = process.env.PORT || 443;
const portRedirect = process.env.PORTREDIRECT || 8080;
const ip = process.env.IP || '0.0.0.0';
// connect to database
db.sequelize
    .sync()
    .then(() => {
        // start the api
        api.listen(port, ip, err =>
            err
                ? logger.error(`🔥  Failed to start API : ${err.stack}`)
                : logger.info(`🌎  API is listening on port ${port}`)
        );
        // start the redirect api
        apiRedirect.listen(portRedirect, ip, err =>
            err
                ? logger.error(`🔥  Failed to start redirect API : ${err.stack}`)
                : logger.info(`🌎  redirect API is listening on port ${portRedirect}`)
        );
        }
    )
    .catch(err => logger.error(`🔥  Failed to connect database : ${err.stack}`));
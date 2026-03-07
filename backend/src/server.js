const app = require('./app');
const { sequelize } = require('./models');
require('dotenv').config();


const PORT = process.env.PORT || 4000;


async function start() {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connection authenticated.');


        // Sync models — in production prefer migrations
        await sequelize.sync({
            // force: false,
            alter: true
        });
        console.log('✅ Models synchronized.');


        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Unable to start server:', error);
        process.exit(1);
    }
}


start();
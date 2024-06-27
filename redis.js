const { createClient } = require('redis');

const startDB = async () => {
    return await createClient()
        .on('error', err => console.log('Redis Client Error', err))
        .connect();
};

module.exports = { startDB };
// Is this one of the few you times you really
// require an agent?
const Agent = require('./src/Agent.js');
const crontab = require('node-crontab');

const jobId = crontab.scheduleJob("*/10 * * * *", function() {
    // You do you
    Agent.makeMoney();
});

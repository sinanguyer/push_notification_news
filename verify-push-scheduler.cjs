
const { handler } = require('./netlify/functions/push-scheduler.cjs');

(async () => {
    console.log("Running Push Scheduler Mock Test...");
    const result = await handler({}, {});
    console.log("Result:", result);
})();

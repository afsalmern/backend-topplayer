const schedule = require("node-schedule");
const { checkUsersWhoDontHavePurchase } = require("../controller/checkuser");

function scheduleTasks() {
    // Schedule task: Check users without purchases every Sunday at 11:00 AM
    schedule.scheduleJob("0 11 * * 0", async () => {
        console.log("Running scheduled task: Check users without purchases...");
        try {
            await checkUsersWhoDontHavePurchase();
            console.log("Task completed successfully.");
        } catch (err) {
            console.error("Error running scheduled task:", err.message);
        }
    });
    console.log("Scheduled tasks initialized.");
}

module.exports = scheduleTasks;

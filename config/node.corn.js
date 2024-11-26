const { roomModel } = require("../models/room.model");
const cron = require("node-cron");
const minutes = 10;
const updateExpiredLocks = async () => {
  const now = new Date();
  try {
    console.log("Running room update job...");
    const result = await roomModel.updateMany(
      {
        isLocked: true,
        lockUntill: { $lt: now },
      },
      {
        $set: {
          isLocked: false,
          lockUntill: now,
        },
      }
    );
    console.log(
      `${result.modifiedCount} documents are modified every to ${minutes}`
    );
  } catch (error) {
    console.error("Error updating room locks:", error);
  }
};

// Schedule the job to run every 15 minutes
cron.schedule(`*/${minutes} * * * *`, updateExpiredLocks, {
  scheduled: true,
});

console.log(`Room updater job scheduled to run every ${minutes} minutes.`);

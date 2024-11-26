const mongoose = require("mongoose");

const isUserSessionData = async (userId) => {
  let sessionData = null;
  const sessiondoc = await mongoose.connection
    .useDb(process.env.DB_NAME)
    .collection(process.env.SESSION_COLLECTION_NAME)
    .findOne({
      session: { $regex: `"userId":"${userId}"` },
    });
  if (sessiondoc) {
    sessionData = JSON.parse(sessiondoc.session);
  }
  return sessiondoc ? sessionData : null;
};

const updateUserSessionData = async (userId, obj) => {
  try {
    const db = mongoose.connection.useDb(process.env.DB_NAME);
    const collection = db.collection(process.env.SESSION_COLLECTION_NAME);

    // Find the session document
    const sessionDoc = await collection.findOne({
      session: { $regex: `"userId":"${userId}"` },
    });

    if (!sessionDoc) {
      console.log("No session document found for the given userId.");
      return;
    }

    // Parse and modify the session data
    let sessionData = JSON.parse(sessionDoc.session);
    sessionData = { ...sessionData, ...obj };

    // Update the session document
    await collection.updateOne(
      { _id: sessionDoc._id }, // Query by the document's _id
      { $set: { session: JSON.stringify(sessionData) } } // Update the session field
    );

    console.log("Session updated successfully.");
  } catch (error) {
    console.error("Error updating user session data:", error);
  }
};

module.exports = { isUserSessionData, updateUserSessionData };

const mongoose = require("mongoose");

const isUserSessionData = async (userId) => {
  //console.log(userId);
  
  let isSessionDataFound = false,
    sessionData = null;
  const sessiondocs = await mongoose.connection
    .useDb(process.env.DB_NAME)
    .collection(process.env.SESSION_COLLECTION_NAME)
    .find({})
    .toArray();
  if (sessiondocs.length > 0) {
    for (const session of sessiondocs) {
      //console.log(session);

      const data = JSON.parse(session.session);
      if (data.userId === userId) {
        isSessionDataFound = true;
        sessionData = { sessionId: session._id, ...data };
        break;
      }
    }
  }
  //console.log(isSessionDataFound, sessionData);

  if (isSessionDataFound && sessionData) {
    return sessionData;
  } else {
    return null;
  }
};

const updateUserSessionData=async(userId)=>{

}

module.exports = { isUserSessionData };

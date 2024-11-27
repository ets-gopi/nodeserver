const { userModel, mongoose } = require("../models/user.model");
const { HttpError, createError } = require("../utils/customError");
const { countdownFormat } = require("../utils/formatDate");
const { signAccessToken } = require("../utils/jwt.tokens");
const {
  isUserSessionData,
  updateUserSessionData,
} = require("../utils/session.helper");

const register = async (req, res, next) => {
  const { email } = req.body;
  try {
    const isExist = await userModel.findOne({ email });
    if (Object.keys(isExist ? isExist : {}).length > 0) {
      throw createError(`${email} already exist.`, 409);
    }
    await userModel.create({ ...req.body });
    res.json({
      status: true,
      bcc: 201,
      message: "User Registered Successfully.",
    });
  } catch (error) {
    console.error(error);

    if (error instanceof HttpError) {
      res.json({
        status: false,
        bcc: error.statusCode,
        message: error.message,
      });
    } else {
      res.json({
        status: false,
        bcc: 500,
        message: "Internal server Issuse.",
      });
    }
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const isExist = await userModel.findOne({ email });
    if (!isExist) {
      throw createError(`${email} does not exit.`, 404);
    }
    const isValid = await isExist.verifyPassword(password);
    if (!isValid) {
      throw createError(`InValid Credentails.`, 401);
    }
    const token = await signAccessToken(isExist._id);
    const isSessionExit = await isUserSessionData(req.sessionID);
    //console.log("isSessionExit", isSessionExit);
    if (!isSessionExit) {
      //create the session.
      req.session.userId = isExist._id.toString();
      req.session.guestDetails = {
        name: isExist?.username,
        email: isExist?.email,
      };
      res.json({
        status: true,
        bcc: 200,
        message: "Ok",
        accessToken: token,
      });
    } else {
      res.json({
        status: true,
        bcc: 200,
        message: "Ok",
        accessToken: token,
      });
    }
  } catch (error) {
    console.error(error);

    if (error instanceof HttpError) {
      res.json({
        status: false,
        bcc: error.statusCode,
        message: error.message,
      });
    } else {
      res.json({
        status: false,
        bcc: 500,
        message: "Internal server Issuse.",
      });
    }
  }
};

const getUserDetails = async (req, res, next) => {
  try {
    const userDoc = await userModel.findById(req.payload.id, {
      _id: 0,
      username: 1,
      email: 1,
    });
    if (!userDoc) {
      throw createError("user does not found.", 404);
    }
    const userObj = userDoc.toObject();
    res.json({
      status: true,
      bcc: 200,
      message: "user data feteched successfully.",
      data: userObj,
    });
  } catch (error) {
    console.error(error);

    if (error instanceof HttpError) {
      res.json({
        status: false,
        bcc: error.statusCode,
        message: error.message,
      });
    } else if (error instanceof mongoose.Error.CastError) {
      res.json({
        status: false,
        bcc: 400,
        message: error.message,
      });
    } else {
      res.json({
        status: false,
        bcc: 500,
        message: "Internal server Issuse.",
      });
    }
  }
};

const manipulateUserSessionData = async (req, res, next) => {
  const { userSearchDetails, cartInfo, count } = req.body;
  try {
    const userdoc = await userModel.findById(req.payload.id, {
      username: 1,
      email: 1,
    });
    if (!userdoc) {
      throw createError("user does not found", 404);
    }
    const isSessionExit = await isUserSessionData(req.sessionID);
    //console.log("isSessionExit", isSessionExit);
    if (!isSessionExit) {
      req.session.userId = userdoc._id.toString();
      req.session.guestDetails = {
        name: userdoc.username,
        email: userdoc.email,
      };
      if (userSearchDetails) {
        req.session.userSearchDetails = userSearchDetails;
      }
      if (cartInfo) {
        req.session.cartInfo = cartInfo;
        req.session.count = count;
      }
    } else {
      if (userSearchDetails) {
        await updateUserSessionData(req.sessionID, {
          userSearchDetails: userSearchDetails,
        });
      }
      if (cartInfo) {
        // console.log("cartInfo", cartInfo);
        await updateUserSessionData(req.sessionID, {
          cartInfo: cartInfo,
          count: count,
        });
      }
    }

    res.json({
      status: true,
      bcc: 200,
      message: "Ok",
    });
  } catch (error) {
    console.error(error);

    if (error instanceof HttpError) {
      res.json({
        status: false,
        bcc: error.statusCode,
        message: error.message,
      });
    } else if (error instanceof mongoose.Error.CastError) {
      res.json({
        status: false,
        bcc: 400,
        message: error.message,
      });
    } else {
      res.json({
        status: false,
        bcc: 500,
        message: "Internal server Issuse.",
      });
    }
  }
};

const getUserSessionData = async (req, res, next) => {
  const currentDatePlusOneDay = new Date();
  currentDatePlusOneDay.setDate(currentDatePlusOneDay.getDate() + 1);

  try {
    const isUserExist = await userModel.findById(req.payload.id);
    if (!isUserExist) {
      throw createError("user does not found", 404);
    }
    const isSessionExit = await isUserSessionData(req.sessionID);
    //console.log("iss",isSessionExit);

    if (isSessionExit) {
      res.json({
        status: true,
        bcc: 200,
        message: "feteched session data successfully.",
        data: {
          userSearchDetails: isSessionExit?.userSearchDetails || {
            checkIn: countdownFormat(new Date()),
            checkOut: countdownFormat(currentDatePlusOneDay),
            totalGuests: 2,
            propertyId: null,
            propertyName: null,
            propertyLocation: null,
            propertyImage: null,
            nights: null,
            totalRooms: null,
          },
          guestDetails: isSessionExit?.guestDetails || {},
          cartInfo: isSessionExit?.cartInfo || [],
          count: isSessionExit.count || 0,
          checkOut: isSessionExit?.checkOut || {},
          billingInfo: isSessionExit?.billingInfo || {},
        },
      });
    } else {
      res.json({
        status: false,
        bcc: 400,
        message: "session expired.",
        data: {
          userSearchDetails: {
            checkIn: countdownFormat(new Date()),
            checkOut: countdownFormat(currentDatePlusOneDay),
            totalGuests: 2,
            propertyId: null,
            propertyName: null,
            propertyLocation: null,
            propertyImage: null,
            nights: null,
            totalRooms: null,
          },
          guestDetails: {
            name: isUserExist?.username,
            email: isUserExist?.email,
          },
          cartInfo: [],
          count: 0,
          checkOut: {},
          billingInfo: {},
        },
      });
    }
  } catch (error) {
    console.error(error);

    if (error instanceof HttpError) {
      res.json({
        status: false,
        bcc: error.statusCode,
        message: error.message,
      });
    } else if (error instanceof mongoose.Error.CastError) {
      res.json({
        status: false,
        bcc: 400,
        message: error.message,
      });
    } else {
      res.json({
        status: false,
        bcc: 500,
        message: "Internal server Issuse.",
      });
    }
  }
};

//logout the user
const logout = async (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        code: "INTERNAL_SERVER_ERROR",
        status: false,
        message: "SOMETHING WENT WRONG.",
      });
    }
    res.clearCookie("session_id");
    res.json({ bcc: 200, status: true, message: "Logout successful" });
  });
};

const userInfo = {
  register,
  login,
  getUserDetails,
  manipulateUserSessionData,
  getUserSessionData,
  logout,
};

module.exports = userInfo;

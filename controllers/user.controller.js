
const { userModel, mongoose } = require("../models/user.model");
const { HttpError, createError } = require("../utils/customError");
const { countdownFormat } = require("../utils/formatDate");
const { signAccessToken } = require("../utils/jwt.tokens");

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
    res.json({
      status: true,
      bcc: 200,
      message: "Ok",
      accessToken: token,
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
    if (!req.session.guestDetails) {
      const userdoc = await userModel.findById(req.payload.id, {
        username: 1,
        email: 1,
      });
      req.session.userId = req.payload.id;
      req.session.guestDetails = {
        name: userdoc.username,
        email: userdoc.email,
      };
    }
    if (userSearchDetails) {
      req.session.userSearchDetails = userSearchDetails;
    }
    if (cartInfo) {
      // console.log("cartInfo", cartInfo);
      req.session.cartInfo = cartInfo;
      req.session.count = count;
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
  let isSessionDataFound = false,
    sessionData = {};
  const currentDatePlusOneDay = new Date();
  currentDatePlusOneDay.setDate(currentDatePlusOneDay.getDate() + 1);
  
  try {
    const sessiondocs = await mongoose.connection
      .useDb("hotel_db")
      .collection("sessions")
      .find({})
      .toArray();
    if (sessiondocs.length > 0) {
      for (const session of sessiondocs) {
        const data = JSON.parse(session.session);
        if (data.userId === req.payload.id) {
          isSessionDataFound = true;
          sessionData = data;
          break;
        }
      }
    }

    if (isSessionDataFound && sessionData) {
      res.json({
        status: true,
        bcc: 200,
        message: "feteched session data successfully.",
        data: {
          userId: sessionData?.userId || req.payload.id,
          userSearchDetails: sessionData?.userSearchDetails || {},
          guestDetails: sessionData?.guestDetails || {},
          cartInfo: sessionData?.cartInfo || [],
          count: sessionData.count || 0,
        },
      });
    } else {
      res.json({
        status: false,
        bcc: 400,
        message: "session expired.",
        data: {
          userId: req.payload.id,
          userSearchDetails: {
            checkIn: countdownFormat(new Date()),
            checkOut: countdownFormat(currentDatePlusOneDay),
            totalGuests: 2,
            propertyId: null,
          },
          guestDetails: {},
          cartInfo: [],
          count: 0,
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

const userInfo = {
  register,
  login,
  getUserDetails,
  manipulateUserSessionData,
  getUserSessionData,
};

module.exports = userInfo;

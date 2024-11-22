const { propertyModel, mongoose } = require("../models/property.model");
const { HttpError, createError } = require("../utils/customError");
const { searchRoomsSchema } = require("../utils/schemaforValidation");
const Validator = require("../utils/validator");
const serachRoomsValidation = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.propertyId)) {
      throw createError("Invalid Property ID.", 400);
    }
    const propertydocs = await propertyModel.findById(req.params.propertyId, {
      _id: 1,
    });
    if (!propertydocs) {
      throw createError("property does not found.", 404);
    }
    const roomsSchema = new Validator(searchRoomsSchema);
    const { data, errors } = roomsSchema.validate({
      ...req.body,
      propertyId: req.params.propertyId,
    });
    console.log(data, errors);
    if (Object.keys(errors).length > 0) {
      throw createError("Invalid Request.", 400, { error: errors });
    }
    req.body = data;
    next();
  } catch (error) {
    console.error(error);

    if (error instanceof HttpError) {
      res.json({
        status: false,
        bcc: error.statusCode,
        message: error.message,
        error: error.error,
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

const userSearchDetailsValidation = async (req, res, next) => {
  const { userSearchDetails } = req.body;
  try {
    if (!userSearchDetails) {
      next();
    } else {
      const roomsSchema = new Validator(searchRoomsSchema);
      const { data, errors } = roomsSchema.validate({
        ...userSearchDetails,
      });
      //console.log(data, errors);
      if (Object.keys(errors).length > 0) {
        throw createError("Invalid Request.", 400, { error: errors });
      }
      req.body = {
        userSearchDetails: data,
      };
      next();
    }
  } catch (error) {
    console.error(error);

    if (error instanceof HttpError) {
      res.json({
        status: false,
        bcc: error.statusCode,
        message: error.message,
        error: error.error,
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

module.exports = { serachRoomsValidation, userSearchDetailsValidation };

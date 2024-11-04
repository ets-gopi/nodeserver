const { propertyModel, mongoose } = require("../models/property.model");
const { HttpError, createError } = require("../utils/customError");
const { searchRoomsSchema } = require("../utils/schemaforValidation");
const Validator = require("../utils/validator");
const serachRoomsValidation = async (req, res, next) => {
  try {
    const propertydocs = await propertyModel.find(
      {},
      {
        _id: 1,
      }
    );
    let propertyIds = [];
    for (const obj of propertydocs) {
      propertyIds.push(obj._id.toString());
    }
    if (
      !propertyIds?.includes(
        mongoose.Types.ObjectId.isValid(req.params.propertyId) &&
          req.params.propertyId
      )
    ) {
      throw createError("Invalid Property ID.", 400);
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
    } else {
      res.json({
        status: false,
        bcc: 500,
        message: "Internal server Issuse.",
      });
    }
  }
};

module.exports = serachRoomsValidation;

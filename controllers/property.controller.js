const { propertyModel, mongoose } = require("../models/property.model");
const userModel = require("../models/user.model");
const { HttpError, createError } = require("../utils/customError");

// create a property.
const createProperty = async (req, res, next) => {
  try {
    const property = await propertyModel.create({ ...req.body });
    //console.log(property);
    await userModel.findByIdAndUpdate(req.payload.id, {
      $addToSet: {
        propertyId: property._id,
      },
    });

    res.json({
      status: true,
      bcc: 201,
      message: `property created successfully.`,
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

// update an property By id.
const updatePropertyById = async (req, res, next) => {
  console.log(req.body);
  const { id } = req.params;
  try {
    const doc = await propertyModel.findById(id);
    if (!doc) {
      throw createError("property does not found.", 404);
    }
    const propertyObj = doc.toObject();
    if (req.body.location) {
      req.body = {
        ...req.body,
        location: { ...propertyObj.location, ...req.body.location },
      };
    }
    if (req.body.contactInfo) {
      req.body = {
        ...req.body,
        contactInfo: { ...propertyObj.contactInfo, ...req.body.contactInfo },
      };
    }
    await propertyModel.findByIdAndUpdate(id, { ...req.body });
    res.json({
      status: true,
      bcc: 200,
      message: "property updated successfully.",
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

//delete an property by id.
const deletePropertyById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const doc = await propertyModel.findByIdAndDelete(id);
    if (!doc) {
      throw createError("property does not found.", 404);
    }
    res.json({
      status: true,
      bcc: 200,
      message: "property data deleted successfully.",
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

// get an property by id.
const getPropertyById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const property = await propertyModel.findById(id, {
      name: 1,
      location: 1,
      description: 1,
      starRating: 1,
      checkInTime: 1,
      checkOutTime: 1,
      availabilityStatus: 1,
      totalRooms: 1,
      availableRooms: 1,
      images: 1,
      thumbnailImage: 1,
      amenities: 1,
      contactInfo: 1,
    });
    if (!property) {
      throw createError("property does not found.", 404);
    }
    const propObj = property.toObject();
    res.json({
      status: true,
      bcc: 200,
      message: "property data feteched successfully.",
      data: propObj,
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

// get all properties.
const getAllProperties = async (req, res, next) => {
  try {
    const allpropertiesdoc = await propertyModel.find(
      {},
      {
        name: 1,
        location: 1,
        description: 1,
        starRating: 1,
        checkInTime: 1,
        checkOutTime: 1,
        availabilityStatus: 1,
        totalRooms: 1,
        availableRooms: 1,
        images: 1,
        thumbnailImage: 1,
        amenities: 1,
        contactInfo: 1,
      }
    );

    res.json({
      status: true,
      bcc: 200,
      message: `All Properties are fetched Successfully.`,
      data: allpropertiesdoc.map((prop, ind) => prop.toObject()),
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

const propertyInfo = {
  createProperty,
  updatePropertyById,
  deletePropertyById,
  getPropertyById,
  getAllProperties,
};

module.exports = propertyInfo;

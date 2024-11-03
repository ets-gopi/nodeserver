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
    const property = await propertyModel.findById(id);
    if (!property) {
      throw createError("property does not found.", 404);
    }
    const propObj = property.toObject();
    res.json({
      status: true,
      bcc: 200,
      message: "property data feteched successfully.",
      data: {
        id: propObj._id,
        name: propObj.name,
        location: propObj.location,
        description: propObj.description,
        starRating: propObj.starRating,
        checkInTime: propObj.checkInTime,
        checkOutTime: propObj.checkOutTime,
        availabilityStatus: propObj.availabilityStatus,
        totalRooms: propObj.totalRooms,
        availableRooms: propObj.availableRooms,
        images: propObj.images,
        thumbnailImage: propObj.thumbnailImage,
        amenities: propObj.amenities,
        contactInfo: propObj.contactInfo,
      },
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
    const allproperties = await propertyModel.find({});

    const modproperties = allproperties?.map((prop, ind) => {
      return {
        id: prop._id,
        name: prop.name,
        location: prop.location,
        description: prop.description,
        starRating: prop.starRating,
        checkInTime: prop.checkInTime,
        checkOutTime: prop.checkOutTime,
        availabilityStatus: prop.availabilityStatus,
        totalRooms: prop.totalRooms,
        availableRooms: prop.availableRooms,
        images: prop.images,
        thumbnailImage: prop.thumbnailImage,
        amenities: prop.amenities,
        contactInfo: prop.contactInfo,
      };
    });

    res.json({
      status: true,
      bcc: 200,
      message: `All Properties are fetched Successfully.`,
      data: modproperties,
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

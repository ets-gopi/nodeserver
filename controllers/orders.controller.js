const { orderModel } = require("../models/order.model");
const { propertyModel } = require("../models/property.model");
const { userModel, mongoose } = require("../models/user.model");
const { createError, HttpError } = require("../utils/customError");

const getOrderDetails = async (req, res, next) => {
  const { orderId } = req.query;
  try {
    const userDoc = await userModel.findById(req.payload.id, {
      _id: 0,
      username: 1,
      email: 1,
    });
    if (!userDoc) {
      throw createError("user does not found.", 404);
    }
    const orderdoc = await orderModel.findOne(
      {
        userId: req.payload.id,
        orderId: orderId,
      },
      {
        propertyId: 1,
        orderId: 1,
        checkIn: 1,
        checkOut: 1,
        roomInfo: 1,
        billingInfo: 1,
        orderCreatedAt: 1,
        orderExpiresAt: 1,
        orderStatus: 1,
        amount: 1,
        currency: 1,
        totalGuests: 1,
        totalRooms: 1,
        nights: 1,
      }
    );
    if (!orderdoc) {
      throw createError("orderId does not found.", 404);
    }
    const propertydoc = await propertyModel.findOne(
      {
        _id: orderdoc.propertyId,
      },
      {
        name: 1,
        location: 1,
        thumbnailImage: 1,
      }
    );

    if (!propertydoc) {
      throw createError("propertyId does not found.", 404);
    }

    res.json({
      status: true,
      bcc: 200,
      message: "order data feteched successfully.",
      data: {
        checkOut: {
          orderId: orderdoc.orderId,
          createdAt: orderdoc.orderCreatedAt,
          expiresAt: orderdoc.orderExpiresAt,
          orderStatus: orderdoc.orderStatus,
        },
        userSearchDetails: {
          propertyId: orderdoc.propertyId,
          propertyImage: propertydoc.thumbnailImage,
          propertyName: propertydoc.name,
          propertyLocation: propertydoc.location,
          checkIn: orderdoc.checkIn,
          checkOut: orderdoc.checkOut,
          totalGuests: orderdoc.totalGuests,
          totalRooms: orderdoc.totalRooms,
          nights: orderdoc.nights,
        },
        cartInfo: orderdoc.roomInfo,
        billingInfo: orderdoc.billingInfo,
        customerInfo: {
          name: userDoc.username,
          email: userDoc.email,
        },
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

const updateOrderDetailsById = async (req, res, next) => {
  const { orderId } = req.params;
  try {
    const userDoc = await userModel.findById(req.payload.id, {
      _id: 0,
      username: 1,
      email: 1,
    });
    if (!userDoc) {
      throw createError("user does not found.", 404);
    }
    let obj = {};
    if (req.body.orderStatus) {
      obj["orderStatus"] = req.body.orderStatus;
    }
    if (req.body.billingInfo) {
      obj["billingInfo"] = req.body.billingInfo;
    }
    const orderdoc = await orderModel.findOneAndUpdate(
      {
        userId: req.payload.id,
        orderId: orderId,
      },
      {
        $set: obj,
      },
      {
        new: true,
      }
    );
    if (!orderdoc) {
      throw createError("orderId does not found.", 404);
    }

    res.json({
      status: true,
      bcc: 200,
      message: "order data updated successfully.",
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

const ordersInfo = { getOrderDetails, updateOrderDetailsById };
module.exports = ordersInfo;

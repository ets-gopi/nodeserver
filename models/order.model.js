const mongoose = require("mongoose");
const { Schema } = mongoose;
// user Schema

const orderSchema = new Schema(
  {
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    orderId: {
      type: String,
      unique: true,
    },
    checkIn: {
      type: Date,
    },
    checkOut: {
      type: Date,
    },
    nights: {
      type: Number,
    },
    totalGuests: {
      type: Number,
    },
    totalRooms: {
      type: Number,
    },
    roomInfo: {
      type: [
        {
          _id: false,
          roomId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Room",
          },
          roomName: {
            type: String,
          },
          roomPrice: {
            type: Number,
          },
          roomQuantity: {
            type: Number,
          },
          guestsPerRoom: {
            type: Number,
          },
        },
      ],
    },
    amount: {
      type: Number,
    },
    currency: {
      type: String,
    },
    billingInfo: {
      type: {
        totalAmount: { type: Number },
        discount: { type: Number },
        gstInfo: {
          type: {
            rate: { type: Number },
            amount: { type: Number },
            sgst: { type: Number },
            cgst: { type: Number },
          },
          _id: false,
        },
        payableAmount: { type: Number },
        paymentStatus: {
          type: String,
          enum: ["Paid", "Pending", "Failed"],
          default: "Pending",
        },
      },
      _id: false,
    },
    orderCreatedAt: {
      type: Date,
    },
    orderExpiresAt: {
      type: Date,
    },
    orderStatus: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// create an model

const orderModel = mongoose.model("orders", orderSchema);

module.exports = { orderModel, mongoose };

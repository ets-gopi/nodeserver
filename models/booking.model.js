const mongoose = require("mongoose");
const { Schema } = mongoose;

// booking Schema

const bookingSchema = new Schema(
  {
    bookingId: {
      type: String,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
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
    couponCode: {
      type: String,
    },
    roomInfo: {
      type: [
        {
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
          enum: ["Paid", "Pending"],
          default: "Pending",
        },
      },
      _id: false,
    },
    customerInfo: {
      type: {
        name: {
          type: String,
        },
        email: { type: String },
      },
      _id: false,
    },
    bookingStatus: {
      type: String,
      enum: ["Pending", "Confirmed", "CheckedIn", "CheckedOut", "Cancelled"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const bookingModel = mongoose.model("Booking", bookingSchema);

module.exports = { bookingModel, mongoose };

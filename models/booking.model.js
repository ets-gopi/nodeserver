const mongoose = require("mongoose");
const { Schema } = mongoose;

// booking Schema

const bookingSchema = new Schema(
  {
    bookingId: {
      type: Number,
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
    numberOfGuests: {
      type: Number,
    },

    couponCode: {
      type: String,
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
        paymentStatus: {
          type: String,
          enum: ["Paid", "Pending"],
          default: "Pending",
        },
      },
      _id: false,
    },
    bookingStatus: {
      type: String,
      enum: ["Pending", "Confirmed", "CheckedIn", "CheckedOut", "Cancelled"],
      default: "Pending",
    },
    roomInfo: {
      type: [
        {
          roomId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Room",
          },
          roomPrice: {
            type: Number,
          },
          roomQuantity: {
            type: Number,
          },
        },
      ],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const bookingModel = mongoose.model("Booking", bookingSchema);

module.exports = { bookingModel, mongoose };

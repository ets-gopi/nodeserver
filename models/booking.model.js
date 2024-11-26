const mongoose = require("mongoose");
const counterModel = require("./counter.model");
async function getNextSequenceValue(fieldName) {
  const counter = await counterModel.findOneAndUpdate(
    { fieldName },
    { $inc: { sequenceValue: 1 } }, // Increment the sequence by 1
    { new: true, upsert: true } // Create the counter if it doesn't exist
  );

  return counter.sequenceValue;
}

const { Schema } = mongoose;

// booking Schema

const bookingSchema = new Schema(
  {
    bookingId: {
      type: Number,
      unique: true,
    },
    orderId: {
      type: String,
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
        razorpayPaymentId: {
          type: String,
        },
        razorpayOrderId: {
          type: String,
        },
        razorpaySignature: {
          type: String,
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

bookingSchema.pre("save", async function (next) {
  const booking = this;
  if (!booking.bookingId) {
    // Only set bookingId if it doesn't exist
    booking.bookingId = await getNextSequenceValue("bookingId");
  }
  next();
});
const bookingModel = mongoose.model("Booking", bookingSchema);

module.exports = { bookingModel, mongoose };

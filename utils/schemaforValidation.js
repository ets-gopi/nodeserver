const userRegisterSchema = {
  username: {
    type: "string",
    required: true,
    minLength: 3,
    trim: true,
  },
  email: {
    type: "string",
    required: true,
    trim: true,
  },
  password: {
    type: "string",
    required: true,
    minLength: 8,
    trim: true,
  },
  isAdmin: {
    type: "boolean",
  },
};

const userLoginSchema = {
  email: {
    type: "string",
    required: true,
    trim: true,
  },
  password: {
    type: "string",
    required: true,
    minLength: 8,
    trim: true,
  },
};

const propertySchema = {
  userId: {
    type: "string",
    required: true,
    trim: true,
  },
  name: {
    type: "string",
    required: true,
    minLength: 3,
    trim: true,
  },
  location: {
    type: {
      address: {
        type: "string",
        trim: true,
        required: true,
      },
      city: {
        type: "string",
        trim: true,
        required: true,
      },
      state: {
        type: "string",
        trim: true,
        required: true,
      },
      country: {
        type: "string",
        trim: true,
        required: true,
      },
      postalCode: {
        type: "string",
        trim: true,
        required: true,
      },
      coordinates: {
        type: {
          latitude: {
            type: "string",
            trim: true,
          },
          longitude: {
            type: "string",
            trim: true,
          },
        },
      },
    },
    required: true,
  },
  description: {
    type: "string",
    required: true,
    trim: true,
  },
  type: {
    type: "string",
    required: true,
    trim: true,
  },
  starRating: {
    type: "number",
  },
  checkInTime: {
    type: "string",
    required: true,
    trim: true,
  },
  checkOutTime: {
    type: "string",
    required: true,
    trim: true,
  },
  availabilityStatus: {
    type: "boolean",
    required: true,
  },
  totalRooms: {
    type: "number",
    required: true,
  },
  availableRooms: {
    type: "number",
    required: true,
  },
  images: {
    type: ["string"],
    required: true,
  },
  thumbnailImage: {
    type: "string",
    required: true,
    trim: true,
  },
  amenities: {
    type: ["string"],
  },
  contactInfo: {
    type: {
      phone: {
        type: "string",
        required: true,
        trim: true,
      },
      email: {
        type: "string",
        required: true,
        trim: true,
      },
      website: {
        type: "string",
        trim: true,
      },
    },
    required: true,
  },
};

const roomSchema = {
  userId: {
    type: "string",
    required: true,
    trim: true,
  },
  propertyId: {
    type: "string",
    required: true,
    trim: true,
  },
  name: {
    type: "string",
    required: true,
    trim: true,
    minLength: 3,
  },
  description: {
    type: "string",
    required: true,
    trim: true,
  },
  roomType: {
    type: "string",
    required: true,
    trim: true,
  },
  BedType: {
    type: "string",
    required: true,
    trim: true,
  },
  maxOccupancy: {
    type: "number",
    required: true,
  },
  numberOfBeds: {
    type: "number",
    required: true,
  },
  pricePerNight: {
    type: "number",
    required: true,
  },
  isAvailable: {
    type: "boolean",
    required: true,
  },
  images: {
    type: ["string"],
    required: true,
  },
  thumbnailImage: {
    type: "string",
    required: true,
    trim: true,
  },
  amenities: {
    type: ["string"],
  },
  quantityAvailable: {
    type: "number",
    required: true,
  },
};

const bookingSchema = {
  userId: {
    type: "string",
    required: true,
    trim: true,
  },
  propertyId: {
    type: "string",
    required: true,
    trim: true,
  },
  checkIn: {
    type: "date",
    required: true,
  },
  checkOut: {
    type: "date",
    required: true,
  },
  totalGuests: {
    type: "number",
    required: true,
  },
  totalRooms: {
    type: "number",
    required: true,
  },
  nights: {
    type: "number",
    required: true,
  },
  couponCode: {
    type: "string",
    // required:true,
    trim: true,
  },
  roomInfo: {
    type: [
      {
        roomId: {
          type: "string",
          required: true,
          trim: true,
        },
        roomName: {
          type: "string",
          required: true,
          trim: true,
        },
        roomPrice: {
          type: "number",
          required: true,
        },
        roomQuantity: {
          type: "number",
          required: true,
        },
        guestsPerRoom: {
          type: "number",
          required: true,
        },
      },
    ],
    required: true,
  },
  billingInfo: {
    type: {
      totalAmount: {
        type: "number",
        required: true,
      },
      discount: { type: "number" },
      gstInfo: {
        type: {
          rate: { type: "number", required: true }, // GST percentage
          amount: { type: "number", required: true },
          sgst: { type: "number", required: true },
          cgst: { type: "number", required: true },
        },
        required: true,
      },
      payableAmount: {
        type: "number",
        required: true,
      },
    },
    required: true,
  },
  customerInfo: {
    type: {
      name: {
        type: "string",
        required: true,
        trim: true,
      },
      email: {
        type: "string",
        required: true,
        trim: true,
      },
    },
    required: true,
  },
};

module.exports = {
  userRegisterSchema,
  userLoginSchema,
  propertySchema,
  roomSchema,
  bookingSchema,
};

const { Types } = require("mongoose");
const { roomModel, mongoose } = require("../models/room.model");
const { HttpError, createError } = require("../utils/customError");

const createRoomByPropertyId = async (req, res, next) => {
  try {
    const roomdoc = await roomModel.create({ ...req.body });

    res.json({
      status: true,
      bcc: 201,
      message: `room created successfully.`,
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

const updateRoomByPropertyIdByRoomId = async (req, res, next) => {
  //console.log(req.body);
  const { propertyId, roomId } = req.params;
  try {
    const doc = await roomModel.findById(roomId);
    if (!doc) {
      throw createError("room does not found.", 404);
    }
    const roomObj = doc.toObject();
    if (
      roomObj["propertyId"].toString() !== propertyId ||
      roomObj["userId"].toString() !== req.payload.id
    ) {
      throw createError("Premission is Restricted.", 401);
    }
    await roomModel.findByIdAndUpdate(roomId, { ...req.body });
    res.json({
      status: true,
      bcc: 200,
      message: "room updated successfully.",
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

const deleteRoomByPropertyIdByRoomId = async (req, res, next) => {
  const { propertyId, roomId } = req.params;
  try {
    const doc = await roomModel.findById(roomId);
    if (!doc) {
      throw createError("room does not found.", 404);
    }
    const roomObj = doc.toObject();
    if (
      roomObj["propertyId"].toString() !== propertyId ||
      roomObj["userId"].toString() !== req.payload.id
    ) {
      throw createError("Premission is Restricted.", 401);
    }
    await roomModel.findByIdAndDelete(roomId);

    res.json({
      status: true,
      bcc: 200,
      message: "room data deleted successfully.",
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

const getAllRooms = async (req, res, next) => {
  try {
    const allRooms = await roomModel.find(
      {},
      {
        name: 1,
        description: 1,
        roomType: 1,
        BedType: 1,
        maxOccupancy: 1,
        numberOfBeds: 1,
        pricePerNight: 1,
        isAvailable: 1,
        images: 1,
        thumbnailImage: 1,
        amenities: 1,
        quantityAvailable: 1,
      }
    );

    res.json({
      status: true,
      bcc: 200,
      message: `All Rooms are fetched Successfully.`,
      data: allRooms,
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

const getRoomById = async (req, res, next) => {
  const { roomId } = req.params;
  try {
    const Roomdoc = await roomModel.findOne(
      { _id: roomId },
      {
        name: 1,
        description: 1,
        roomType: 1,
        BedType: 1,
        maxOccupancy: 1,
        numberOfBeds: 1,
        pricePerNight: 1,
        isAvailable: 1,
        images: 1,
        thumbnailImage: 1,
        amenities: 1,
        quantityAvailable: 1,
      }
    );
    if (!Roomdoc) {
      throw createError("room dose not exit", 404);
    }
    res.json({
      status: true,
      bcc: 200,
      message: `Room data  fetched Successfully.`,
      data: Roomdoc.toObject(),
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

const getRoomByPropertyId = async (req, res, next) => {
  const { propertyId } = req.params;
  try {
    const Roomsdoc = await roomModel.find(
      { propertyId },
      {
        name: 1,
        description: 1,
        roomType: 1,
        BedType: 1,
        maxOccupancy: 1,
        numberOfBeds: 1,
        pricePerNight: 1,
        isAvailable: 1,
        images: 1,
        thumbnailImage: 1,
        amenities: 1,
        quantityAvailable: 1,
      }
    );
    if (Roomsdoc.length === 0) {
      throw createError("rooms does not exit", 404);
    }
    res.json({
      status: true,
      bcc: 200,
      message: `Rooms data  fetched Successfully.`,
      data: Roomsdoc.map((room, ind) => room.toObject()),
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

const getRoomsByUserId = async (req, res, next) => {
  try {
    const Roomsdoc = await roomModel.find(
      { userId: req.payload.id },
      {
        name: 1,
        description: 1,
        roomType: 1,
        BedType: 1,
        maxOccupancy: 1,
        numberOfBeds: 1,
        pricePerNight: 1,
        isAvailable: 1,
        images: 1,
        thumbnailImage: 1,
        amenities: 1,
        quantityAvailable: 1,
      }
    );
    if (!Roomsdoc) {
      throw createError("user property data does not found.", 404);
    }
    res.json({
      status: true,
      bcc: 200,
      message: "rooms data feteched successfully.",
      data: Roomsdoc,
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

const getRoomByUserIdByRoomId = async (req, res, next) => {
  const { userId, roomId } = req.params;
  try {
    const doc = await roomModel.findById(roomId);
    if (!doc) {
      throw createError("room does not found.", 404);
    }
    const roomObj = doc.toObject();
    if (roomObj["userId"].toString() !== userId) {
      throw createError("Premission is Restricted.", 401);
    }
    res.json({
      status: true,
      bcc: 200,
      message: "room data feteched successfully.",
      data: doc,
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

const searchRoomsByPropertyId = async (req, res, next) => {
  const { checkIn, checkOut } = req.body;
  const { propertyId } = req.params;

  try {
    const rooms = await roomModel.aggregate([
      {
        $match: {
          propertyId: new mongoose.Types.ObjectId(propertyId),
          isAvailable: true,
        },
      },
      {
        $project: {
          name: 1,
          description: 1,
          roomType: 1,
          BedType: 1,
          maxOccupancy: 1,
          numberOfBeds: 1,
          pricePerNight: 1,
          images: 1,
          thumbnailImage: 1,
          amenities: 1,
          quantityAvailable: 1,
          isAvailable: 1,
          bookings: {
            $filter: {
              input: "$bookings",
              as: "booking",
              cond: {
                $and: [
                  { $lt: ["$$booking.checkIn", new Date(checkOut)] },
                  { $gt: ["$$booking.checkOut", new Date(checkIn)] },
                  {
                    $in: [
                      "$$booking.bookingStatus",
                      ["Confirmed", "CheckedIn", "Pending"],
                    ],
                  },
                ],
              },
            },
          },
        },
      },
      {
        $project: {
          name: 1,
          description: 1,
          roomType: 1,
          BedType: 1,
          maxOccupancy: 1,
          numberOfBeds: 1,
          pricePerNight: 1,
          images: 1,
          thumbnailImage: 1,
          amenities: 1,
          quantityAvailable: 1,
          bookings: 1,
          isAvailable: 1,
          roomQuantityBooked: {
            $cond: {
              if: { $gt: [{ $size: "$bookings" }, 0] },
              then: {
                $sum: "$bookings.roomQuantity",
              },
              else: 0,
            },
          },
          roomsLeft: {
            $subtract: [
              "$quantityAvailable",
              {
                $cond: {
                  if: { $gt: [{ $size: "$bookings" }, 0] },
                  then: {
                    $sum: "$bookings.roomQuantity",
                  },
                  else: 0,
                },
              },
            ],
          },
        },
      },
      {
        $match: {
          roomsLeft: { $gt: 0 },
        },
      },
      {
        $project: {
          name: 1,
          description: 1,
          roomType: 1,
          BedType: 1,
          maxOccupancy: 1,
          numberOfBeds: 1,
          pricePerNight: 1,
          images: 1,
          thumbnailImage: 1,
          amenities: 1,
          quantityAvailable: 1,
          isAvailable: 1,
          roomsLeft: 1,
        },
      },
    ]);
    res.json({
      status: true,
      bcc: 200,
      message: "Ok",
      data: rooms,
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

const roomInfo = {
  createRoomByPropertyId,
  updateRoomByPropertyIdByRoomId,
  deleteRoomByPropertyIdByRoomId,
  getAllRooms,
  getRoomsByUserId,
  getRoomByUserIdByRoomId,
  getRoomById,
  getRoomByPropertyId,
  searchRoomsByPropertyId,
};

module.exports = roomInfo;

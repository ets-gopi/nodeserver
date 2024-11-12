// working with transactions in mongodb.
const { bookingModel, mongoose } = require("../models/booking.model");
const { roomModel } = require("../models/room.model");
const { userModel } = require("../models/user.model");
const { HttpError, createError } = require("../utils/customError");
const { delay } = require("../utils/delay");

const handleErrorResponse = (error, res) => {
  if (error instanceof HttpError) {
    res.json({
      status: false,
      bcc: error.statusCode,
      message: error.message,
      error: error?.error,
    });
  } else if (error instanceof mongoose.Error.CastError) {
    res.json({
      status: false,
      bcc: 400,
      message: error.message,
    });
  } else if (error.hasErrorLabel("TransientTransactionError")) {
    res.json({
      status: false,
      bcc: 503,
      message:
        "There was a conflict while processing your booking. Please try again later.",
      error: error.message,
    });
  } else {
    res.json({
      status: false,
      bcc: 500,
      message: "Internal server Issue.",
    });
  }
};

const transactionMiddleware = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction({
    readConcern: { level: "snapshot" },
    writeConcern: { w: "majority" },
    readPreference: "primary",
  });
  req.bookingSession = session;
  next();
};

const checkRoomAvailability = async (req, res, next) => {
  const incomingRoomIds = req.body.roomInfo.map(
    (room) => new mongoose.Types.ObjectId(room.roomId)
  );
  let conflictRoomsQuantityInfo = [];
  let availabilityCheck = true;
  let unavailableRooms = [];
  const session = req.bookingSession;
  try {
    const conflictBookings = await bookingModel
      .aggregate([
        {
          $match: {
            $and: [
              {
                propertyId: new mongoose.Types.ObjectId(req.body.propertyId),
              },
              { checkIn: { $lt: new Date(req.body.checkOut) } },
              { checkOut: { $gt: new Date(req.body.checkIn) } },
              {
                bookingStatus: { $in: ["Confirmed", "Pending", "CheckedIn"] },
              },
            ],
          },
        },
        {
          $lookup: {
            from: "rooms",
            let: {
              roomIds: "$roomInfo.roomId",
              incomingRoomIds: incomingRoomIds,
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $in: ["$_id", "$$roomIds"] },
                      { $in: ["$_id", "$$incomingRoomIds"] },
                    ],
                  },
                },
              },
              {
                $project: {
                  _id: 1,
                  name: 1,
                  quantityAvailable: 1,
                },
              },
            ],
            as: "roomsConflictDetailInfo",
          },
        },
        {
          $project: {
            roomInfo: 1,
            roomsConflictDetailInfo: 1,
          },
        },
      ])
      .session(session);
    if (conflictBookings.length !== 0) {
      for (const booking of conflictBookings) {
        const { roomInfo, roomsConflictDetailInfo } = booking;
        // adding the total room quantity in conflicts rooms.
        if (roomsConflictDetailInfo.length > 0) {
          for (const conflictRoom of roomsConflictDetailInfo) {
            const isFound = conflictRoomsQuantityInfo.find(
              (cr, ind) => cr.roomId === conflictRoom._id.toString()
            );
            const roomDetail = roomInfo.find(
              (rd) => rd.roomId.toString() === conflictRoom._id.toString()
            );
            if (!isFound) {
              conflictRoomsQuantityInfo.push({
                roomId: roomDetail.roomId.toString(),
                roomtotalBookedQuantity: roomDetail.roomQuantity,
                quantityAvailable: conflictRoom.quantityAvailable,
              });
            } else {
              isFound.roomtotalBookedQuantity =
                isFound.roomtotalBookedQuantity + roomDetail.roomQuantity;
            }
          }
        }
      }
    }
    for (const inputroominfo of req.body.roomInfo) {
      // find the input conflict room.
      const isInputConflictRoom = conflictRoomsQuantityInfo.find(
        (cr, ind) => cr.roomId === inputroominfo.roomId
      );
      if (isInputConflictRoom) {
        // find the total quantity of room type.
        const totalQuantity =
          inputroominfo.roomQuantity +
          isInputConflictRoom.roomtotalBookedQuantity;
        if (totalQuantity > isInputConflictRoom.quantityAvailable) {
          availabilityCheck = false;
          unavailableRooms.push({
            roomId: inputroominfo.roomId,
            roomName: inputroominfo.roomName,
            requested: inputroominfo.roomQuantity,
            available:
              isInputConflictRoom.roomtotalBookedQuantity >=
              isInputConflictRoom.quantityAvailable
                ? "Insufficient Rooms"
                : isInputConflictRoom.quantityAvailable -
                  isInputConflictRoom.roomtotalBookedQuantity,
          });
        }
      } else {
        // find the room quantity based on the propertyId and roomId.
        const roomDoc = await roomModel
          .findOne(
            {
              _id: new mongoose.Types.ObjectId(inputroominfo.roomId),
              propertyId: new mongoose.Types.ObjectId(req.body.propertyId),
            },
            {
              quantityAvailable: 1,
            }
          )
          .session(session);
        if (inputroominfo.roomQuantity > roomDoc.quantityAvailable) {
          (availabilityCheck = false),
            unavailableRooms.push({
              roomId: inputroominfo.roomId,
              roomName: inputroominfo.roomName,
              requested: inputroominfo.roomQuantity,
              available: roomDoc.quantityAvailable,
            });
        }
      }
    }
    if (!availabilityCheck) {
      throw createError("Rooms are not available", 400, {
        error: unavailableRooms,
      });
    }
    next();
  } catch (error) {
    console.error("checkRoomAvailability", error);
    await session.abortTransaction();
    await session.endSession();
    handleErrorResponse(error, res);
  }
};

const reserveRooms = async (req, res, next) => {
  const session = req.bookingSession;

  try {
    for (const roomInfo of req.body.roomInfo) {
      const roomId = new mongoose.Types.ObjectId(roomInfo.roomId);
      const result = await roomModel
        .updateOne(
          {
            _id: roomId,
            propertyId: new mongoose.Types.ObjectId(req.body.propertyId),
            isLocked: false,
          },
          {
            $set: { isLocked: true },
          }
        )
        .session(session);

      if (result.modifiedCount === 0) {
        // If no document was modified, it means the room is either already locked or not available
        throw createError(
          "Room is not available for provisional reservation",
          400
        );
      }
    }
    next();
  } catch (error) {
    console.error("reserveRooms", error);
    await session.abortTransaction();
    session.endSession();
    handleErrorResponse(error, res);
  }
};

const createBooking = async (req, res, next) => {
  const session = req.bookingSession;
  try {
    // create booking if room are available.
    const booking = new bookingModel({ ...req.body });

    await booking.save({ session: session });
    req.bookingDetails = booking.toObject();
    next();
  } catch (error) {
    console.error("createBooking", error);
    await session.abortTransaction();
    await session.endSession();
    handleErrorResponse(error, res);
  }
};

const updateRooms = async (req, res, next) => {
  const session = req.bookingSession;

  try {
    const { checkIn, checkOut, bookingStatus, bookingId } = req.bookingDetails;
    for (const inputroominfo of req.body.roomInfo) {
      // find the room based on the propertyId and room Id.
      const roomUpdateDoc = await roomModel.findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(inputroominfo.roomId),
          propertyId: new mongoose.Types.ObjectId(req.body.propertyId),
        },
        {
          $push: {
            bookings: {
              checkIn,
              checkOut,
              roomQuantity: inputroominfo.roomQuantity,
              bookingStatus,
              bookingId,
            },
          },
          $set: {
            isLocked: false,
          },
        },
        {
          session: session,
          new: true,
        }
      );
      if (!roomUpdateDoc) {
        throw createError(
          `Room with ID ${inputroominfo.roomId} not found`,
          404
        );
      }
    }

    next();
  } catch (error) {
    console.error("updateRooms", error);
    await session.abortTransaction();
    await session.endSession();
    handleErrorResponse(error, res);
  }
};

const updateUserInfo = async (req, res, next) => {
  const session = req.bookingSession;
  try {
    const user = await userModel.findOneAndUpdate(
      {
        _id: req.body.userId,
      },
      {
        $push: {
          bookings: req.bookingDetails._id,
        },
      },
      {
        session: session,
        new: true,
      }
    );
    if (!user) {
      throw createError("User not found", 404);
    }
    next();
  } catch (error) {
    console.error("updateUserInfo", error);
    await session.abortTransaction();
    await session.endSession();
    handleErrorResponse(error, res);
  }
};

const finalizeBooking = async (req, res, next) => {
  const session = req.bookingSession;
  try {
    // Once all other updates are done, commit the transaction
    await session.commitTransaction();
    res.json({
      status: true,
      bcc: 201,
      message: "Booking Created Successfully.",
    });
  } catch (error) {
    console.error("finalizeBooking", error);
    await session.abortTransaction();
    handleErrorResponse(error, res);
  } finally {
    await session.endSession();
  }
};

const testing = async (req, res, next) => {
  const checkin = "2024-11-10";
  const checkout = "2024-11-16";
  const bookingdocs = await bookingModel.find(
    {
      $and: [
        { propertyId: "650d53c1a7dfc56e1f0b8bc3" },
        { checkIn: { $lt: new Date(checkout) } },
        { checkOut: { $gt: new Date(checkin) } },
        {
          bookingStatus: { $in: ["Confirmed", "Pending", "CheckedIn"] },
        },
      ],
    },
    { roomInfo: 1 }
  );

  res.send(bookingdocs);
};

const bookingInfo = {
  transactionMiddleware,
  checkRoomAvailability,
  reserveRooms,
  createBooking,
  updateRooms,
  updateUserInfo,
  finalizeBooking,
  testing,
};
module.exports = bookingInfo;

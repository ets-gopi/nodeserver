// working with transactions in mongodb.
const { bookingModel, mongoose } = require("../models/booking.model");
const { roomModel } = require("../models/room.model");
const createBooking = async (req, res, next) => {
  console.log(req.body);
  const incomingRoomIds = req.body.roomInfo.map(
    (room) => new mongoose.Types.ObjectId(room.roomId)
  );
  let conflictRoomsQuantityInfo = [];
  let availabilityCheck = true;
  let unavailableRooms = [];
  // start the session for
  const session = await mongoose.startSession();
  // console.log("Session ID:", session.id);
  // console.log("Transaction State:", session.transaction.state);
  // console.log("mongodb",mongoose.connection.db.databaseName);

  try {
    session.startTransaction();
    //console.log("Transaction State:", session.transaction.state);
    //check the conflict in booking details.
    const conflictBookings = await bookingModel.aggregate([
      {
        $match: {
          $and: [
            {
              propertyId: new mongoose.Types.ObjectId(
                "650d53c1a7dfc56e1f0b8bc3"
              ),
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
    ]);

    // //console.log(conflictBookings);
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
    // // find the unavaiable room type.
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
        const roomDoc = await roomModel.findOne(
          {
            _id: new mongoose.Types.ObjectId(inputroominfo.roomId),
            propertyId: new mongoose.Types.ObjectId(req.body.propertyId),
          },
          {
            maxOccupancy: 1,
          }
        );
        if (inputroominfo.roomQuantity > roomDoc.maxOccupancy) {
          (availabilityCheck = false),
            unavailableRooms.push({
              roomId: inputroominfo.roomId,
              roomName: inputroominfo.roomName,
              requested: inputroominfo.roomQuantity,
              available: roomDoc.maxOccupancy,
            });
        }
      }
    }
    if (!availabilityCheck) {
      return res.json({
        status: false,
        bcc: 400,
        message: "No Rooms Are Available.",
        data: unavailableRooms,
      });
    }

    // create booking if room are available.

    await session.commitTransaction();
    console.log("Transaction State:", session.transaction.state);
    res.json({
      status: true,
      bcc: 201,
      data: conflictBookings,
    });
  } catch (error) {
    console.error(error);

    await session.abortTransaction();
    res.json({
      status: false,
    });
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

const bookingInfo = { createBooking, testing };
module.exports = bookingInfo;

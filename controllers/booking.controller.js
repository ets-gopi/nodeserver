// working with transactions in mongodb.
const { bookingModel, mongoose } = require("../models/booking.model");
const { roomModel } = require("../models/room.model");
const createBooking = async (req, res, next) => {
  console.log(req.body);
  let conflictRoomsInfo = [];
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
          let: { roomIds: "$roomInfo.roomId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$_id", "$$roomIds"],
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
          as: "roomDetails",
        },
      },
      {
        $project: {
          roomInfo: 1,
          roomDetails: 1,
        },
      },
    ]);
    //console.log(conflictBookings);
    if (conflictBookings.length !== 0) {
      for (const booking of conflictBookings) {
        const { roomInfo, roomDetails } = booking;
        // adding the total room quantity in conflicts rooms.
        for (const conflictRoom of roomInfo) {
          const isInsidetheRoomInfo = req.body.roomInfo.find(
            (irf, ind) => irf.roomId === conflictRoom.roomId.toString()
          );

          if (isInsidetheRoomInfo) {
            const isFound = conflictRoomsInfo.find(
              (cr, ind) => cr.roomId === conflictRoom.roomId.toString()
            );
            if (!isFound) {
              conflictRoomsInfo.push({
                roomId: conflictRoom.roomId.toString(),
                roomQuantity: conflictRoom.roomQuantity,
                quantityAvailable: roomDetails.find(
                  (rd, ind) =>
                    rd._id.toString() === conflictRoom.roomId.toString()
                ).quantityAvailable,
              });
            } else {
              isFound.roomQuantity =
                isFound.roomQuantity + conflictRoom.roomQuantity;
            }
          }
        }
      }
    }
    console.log(conflictRoomsInfo);

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

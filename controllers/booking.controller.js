// working with transactions in mongodb.
const { bookingModel, mongoose } = require("../models/booking.model");

const createBooking = async (req, res, next) => {
  console.log(req.body);
  // start the session for
  const session = await mongoose.startSession();
  // console.log("Session ID:", session.id);
  // console.log("Transaction State:", session.transaction.state);
  // console.log("mongodb",mongoose.connection.db.databaseName);

  try {
    session.startTransaction();
    //console.log("Transaction State:", session.transaction.state);
    //check the conflict in booking details.
    const bookingdocs = await bookingModel.find({});

    await session.commitTransaction();
    console.log("Transaction State:", session.transaction.state);
    res.json({
      status: true,
      bcc: 201,
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
  const bookingdocs = await bookingModel.find({
    $and: [
      { propertyId: "650d53c1a7dfc56e1f0b8bc3" },
      { checkIn: { $lt: new Date(checkout) } },
      { checkOut: { $gt: new Date(checkin) } },
      {
        bookingStatus: { $in: ["Confirmed", "Pending", "CheckedIn"] },
      },
    ],
  });

  res.send(bookingdocs);
};

const bookingInfo = { createBooking, testing };
module.exports = bookingInfo;

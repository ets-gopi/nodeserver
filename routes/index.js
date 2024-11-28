const express = require("express");
const router = express.Router();
const propertyRoutes = require("./propertyRoutes");
const roomRoutes = require("./roomRoutes");
const userRoutes = require("./userRoutes");
const bookingRoutes = require("./bookingRoutes");
const orderRoutes = require("./orderRoutes");
const defaultRoutes = [
  {
    path: "/api/properties",
    route: propertyRoutes,
  },
  {
    path: "/api/rooms",
    route: roomRoutes,
  },
  {
    path: "/api/auth",
    route: userRoutes,
  },
  {
    path: "/api/bookings",
    route: bookingRoutes,
  },
  {
    path: "/api/orders",
    route: orderRoutes,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;

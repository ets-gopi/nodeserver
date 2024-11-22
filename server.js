const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const session = require("express-session");
const MongoStore = require("connect-mongo");
const routes = require("./routes");
const connectDB = require("./config/db.config");
connectDB();

const app = express();

const corsOptions = {
  origin: "http://localhost:3000", 
  credentials: true,
};

app.use(cors(corsOptions));

// set up session middleware.
app.use(
  session({
    secret: process.env.SESSION_SCERET,
    name: "session_id",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      dbName: process.env.DB_NAME,
      collectionName: process.env.SESSION_COLLECTION_NAME,
    }),
    cookie: {
      path: "/",
      secure: false,
      httpOnly: true,
      maxAge: 7200000,
    },
  })
);

// Logging middleware to check session data
app.use((req, res, next) => {
  console.log("Session ID:", req.sessionID);
  console.log("Session Data:", req.session);
  console.log("Cookies:", req.cookies);
  console.log("Session Cookie:", req.headers.cookie);
  next();
});
// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("server is running.");
});

app.use("/v1", routes);

// Catch undefined routes and respond with a 404
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT;

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);

const express = require('express');
const cors = require('cors');
const dotenv=require("dotenv");
const routes=require("./routes");
const connectDB=require("./config/db.config");
dotenv.config();
connectDB();

const app = express();

app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));


app.get("/",(req,res)=>{
    res.send("server is running.")
})

app.use("/v1",routes);

// Catch undefined routes and respond with a 404
app.use((req, res, next) => {
    res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

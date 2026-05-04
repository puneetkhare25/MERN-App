import express, { Request, Response } from "express";
const app = express();
const PORT = process.env.PORT || 3000;

require("dotenv").config();

const cors = require("cors");

//! My Routes
const connectDB = require("./config/db");
const userRouter = require("./routes/userRoute");
const productRouter = require("./routes/productRoute");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

//! API endpoints
app.use("/api/user", userRouter);
app.use("/api/products", productRouter);
app.use("/images", express.static("uploads"));

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
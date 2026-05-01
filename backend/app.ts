import express, { Request, Response } from "express";
const app = express();
const PORT = process.env.PORT || 3000;

require("dotenv").config();

const cors = require('cors');

//! My packages
const connectDB = require('./config/db');
// const userRouter = require('./routes/userRoute');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

connectDB();

//! API endpoints
// app.use("/api/food", foodRouter);
// app.use("/images", express.static('uploads'));

/* app.get("/", (req: Request, res: Response) => {
    res.send("Hello, World!");
}); */

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
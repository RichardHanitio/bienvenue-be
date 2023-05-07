const express = require('express');
const dotenv = require('dotenv');
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const usersRouter = require("./users.router");
const errorHandlerMiddleware = require("../utils/errorHandler");

dotenv.config();
const app = express();

const listen = async () => {
  await connectToMongodb();
  app.listen(process.env.PORT, () => {
    console.log("Backend listening on port "+process.env.PORT)
  })  
}

mongoose.connection.on("disconnected", () => console.log("MongoDB disconnected"));
mongoose.connection.on("connected", () => console.log("MongoDB connected"));

// middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended : true}))
app.use("/", usersRouter);


const connectToMongodb = () => {
  return mongoose.connect(process.env.MONGODBURL).then(
    () => console.log("Mongodb connected"),
    err => console.log("Mongodb error: " + err)
  )
}

app.get("/", (req, res) => res.send("Welcome to Bienvenue Users Services."))

// middlewares
app.use(errorHandlerMiddleware);

listen();
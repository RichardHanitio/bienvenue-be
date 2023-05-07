const express = require('express');
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const proxy = require("express-http-proxy");

const app = express();

// middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended : true}))

// proxies
app.use("/api/auth", proxy("http://localhost:5001"))
app.use("/api/menus", proxy("http://localhost:5002"))
app.use("/api/reservations", proxy("http://localhost:5003"))
app.use("/api/users", proxy("http://localhost:5004"))

app.get("/", (req, res) => res.send("Welcome to Bienvenue API. If you found any bugs, please report to richardhan82@gmail.com"))

app.listen(5000, () => {
  console.log("Gateway is listening on port 5000")
})  
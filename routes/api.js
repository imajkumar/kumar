const express = require("express");
// const authRouter = require("./auth");
const bookRouter = require("./userRoute");

const app = express();

// app.use("/auth/", authRouter);
app.use("/", bookRouter);

module.exports = app;
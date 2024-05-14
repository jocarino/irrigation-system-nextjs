const express = require("express");
const { PrismaClient } = require("@prisma/client");

const morgan = require("morgan");
const { ppid } = require("process");
const prisma = new PrismaClient();
const app = express();
const users = require("./routes/users");
const plants = require("./routes/plants");

//use json
app.use(express.json());

app.use(morgan("dev"));
//cors
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

//test api with error handling
app.get("/test", (req, res, next) => {
  try {
    res.status(200).json({ message: "hi6" });
  } catch (err) {
    next(err);
  }
});

// Routes
app.use("/users", users);
app.use("/plants", plants);

//Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

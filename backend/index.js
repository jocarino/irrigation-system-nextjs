const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");
const users = require("./routes/users");
const plants = require("./routes/plants");
const auth = require("./routes/auth");
const session = require("express-session");
const SQLiteStore = require("connect-sqlite3")(session);
var passport = require("passport");

//use json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session
app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: new SQLiteStore({ db: "sessions.db", dir: "./var/db" }),
  })
);
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(morgan("dev"));
//cors
const corsOptions = {
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

//test api with error handling
app.get("/test", (req, res, next) => {
  try {
    res.status(200).json({ message: "hi6" });
  } catch (err) {
    next(err);
  }
});

// Routes
app.use("/api/users", users);
app.use("/api/plants", plants);
app.use("/api", auth);

//Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`Server running on port http://127.0.0.1:${PORT}`)
);

// Custom error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

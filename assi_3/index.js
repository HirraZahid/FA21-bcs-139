//imports
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const ejsLayouts = require("express-ejs-layouts");
const routes = require("./routes/routes");

// Create express app
const app = express();
const PORT = process.env.PORT || 4000;

// Database connection
mongoose.connect(process.env.DB_URI, {});
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to database"));

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  session({
    secret: "my secret key",
    saveUninitialized: true,
    resave: false,
  })
);

// Delete session message
app.use((req, res, next) => {
  delete req.session.message;
  next();
});

// Set up EJS
app.set("view engine", "ejs");
app.use(ejsLayouts);
app.use(express.static("public"));

// Routes
app.use("/", routes);

// Start server
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});

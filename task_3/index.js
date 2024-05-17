require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const ejsLayouts = require("express-ejs-layouts");
const routes = require("./routes/routes");
const userRoute = require("./routes/user");

// Import the Blog model
const Blog = require("./models/blogs-model");

// Create express app
const app = express();
const PORT = process.env.PORT || 4000;

// Database connection
mongoose.connect(process.env.DB_URI, {});
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to database"));

// Middleware
app.use(express.urlencoded({ extended: false })); // to parse URL-encoded bodies
app.use(express.json()); // to parse req body

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
app.use("/user", userRoute);

// Fetch all blog data
// GET all blog posts with pagination
app.get('/blogs-data', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const blogs = await Blog.find({}).skip(skip).limit(limit);
    res.status(200).json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET a specific blog post by ID
app.get('/blogs-data/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      res.status(404).json({ message: "Blog not found" });
      return;
    }
    res.status(200).json(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update a specific blog post by ID
app.put('/blogs-data/:id', async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!blog) {
      res.status(404).json({ message: "Blog not found" });
      return;
    }
    res.status(200).json(blog);
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a specific blog post by ID
app.delete('/blogs-data/:id', async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      res.status(404).json({ message: "Blog not found" });
      return;
    }
    res.status(200).json(blog);
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add a new blog post
app.post('/blogs-data', async (req, res) => {
  try {
    const { authorName, title, imageUrl, content, type, date } = req.body;
    const newBlog = new Blog({ authorName, title, imageUrl, content, type, date });
    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (error) {
    console.error('Error adding blog:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log("Server started at http://localhost:${PORT}");
});

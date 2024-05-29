require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const ejsLayouts = require("express-ejs-layouts");
const routes = require("./routes/routes");


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
    secret: 'my secret key',
    resave: false,
    saveUninitialized: true,
  })
);


app.use((req, res, next)=>{
  res.locals.message = req.session.message;
  res.locals.user = req.session.user;
  // delete res.locals.message;
  next();
});







// Set up EJS
app.set("view engine", "ejs");
app.use(ejsLayouts);
app.use(express.static("public"));

// Routes
app.use("/", routes);

// Fetch all blog data
// GET all blog posts with pagination
// app.get('/blogs-data', async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const skip = (page - 1) * limit;

//     const blogs = await Blog.find({}).skip(skip).limit(limit);
//     res.status(200).json(blogs);
//   } catch (error) {
//     console.error('Error fetching blogs:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });
app.use(require("./middlewares/main-site"));
const authRouter = require("./routes/auth");
app.use(authRouter);


app.get('/blogs-data', async (req, res) => {
  try {
      // Check if page and limit parameters are provided in the URL query
      if (req.query.page && req.query.limit) {
          // If pagination parameters are provided, apply pagination
          const page = parseInt(req.query.page);
          const limit = parseInt(req.query.limit);
          const skip = (page - 1) * limit;

          const blogs = await Blog.find({}).skip(skip).limit(limit);
          res.status(200).json(blogs);
      } else {
          // If no pagination parameters are provided, fetch all records
          const blogs = await Blog.find({});
          res.status(200).json(blogs);
      }
  } catch (err) {
      console.error('Error fetching blogs:', err);
      res.status(500).send({ message: err.message });
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
// Route to handle search
/*
app.get('/search', async (req, res) => {
  try {
    const searchQuery = req.query.query;
    const blogs = await Blog.find({ title: { $regex: new RegExp(searchQuery, 'i') } }); // Case-insensitive search for titles
    res.render('searchResults', {
      title: `Search Results for "${searchQuery}"`,
      blogs,
      searchQuery
    });
  } catch (error) {
    console.error('Error searching blogs:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
*/
// Route to handle search with pagination
// Route to handle search with pagination and search history
app.get('/search', async (req, res) => {
  try {
    const searchQuery = req.query.query;
    
    // Save search term in session history
    if (!req.session.searchHistory) {
      req.session.searchHistory = [];
    }
    req.session.searchHistory.push(searchQuery);

    const page = parseInt(req.query.page) || 1;
    const limit = 1; // Display only one blog per page
    const skip = (page - 1) * limit;

    const blogs = await Blog.find({ title: { $regex: new RegExp(searchQuery, 'i') } })
                              .skip(skip)
                              .limit(limit);
    
    const totalBlogsCount = await Blog.countDocuments({ title: { $regex: new RegExp(searchQuery, 'i') } });
    const totalPages = Math.ceil(totalBlogsCount / limit);
    const hasNextPage = page < totalPages;
    
    res.render('searchResults', {
      title: `Search Results for "${searchQuery}"`,
      blogs,
      searchQuery,
      page,
      totalPages,
      hasNextPage,
      searchHistory: req.session.searchHistory // Pass search history to the template
    });
  } catch (error) {
    console.error('Error searching blogs:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Fetch all featured blogs
app.get('/featured-blogs', async (req, res) => {
  try {
    const featuredBlogs = await Blog.find({ isFeatured: true });
    res.json(featuredBlogs);
  } catch (err) {
    res.status(500).send(err.message);
  }
});
// Route to serve single blog page
// Route to serve single blog page
app.get('/singleBlog', async (req, res) => {
  const blogId = req.query.id;

  try {
    // Fetch the blog data from your database based on blogId
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).send('Blog not found');
    }

    // Add blog ID to session
    if (!req.session.visitedBlogs) {
      req.session.visitedBlogs = [];
    }
    if (!req.session.visitedBlogs.includes(blogId)) {
      req.session.visitedBlogs.push(blogId);
    }

    res.render('singleBlog', { blog });
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).send('Internal Server Error');
  }
});
// Route to display visited blogs
app.get('/visited-blogs', async (req, res) => {
  const visitedBlogIds = req.session.visitedBlogs || [];

  try {
      // Fetch the blog data for the visited blogs
      const blogs = await Blog.find({ '_id': { $in: visitedBlogIds } }).exec();
      res.render('visitedBlogs', { title: 'Visited Blogs',blogs });
  } catch (error) {
      console.error('Error fetching visited blogs:', error);
      res.status(500).send('Error fetching visited blogs');
  }
});


// Start server
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
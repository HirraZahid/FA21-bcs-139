const express = require('express');
const Blog = require('./models/blogs-model'); // Adjust the path as necessary

const router = express.Router();

router.get('/blogs/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).send('Blog not found');
    }
    
    // Add the blog ID to the session
    if (!req.session.visitedBlogs) {
      req.session.visitedBlogs = [];
    }
    if (!req.session.visitedBlogs.includes(req.params.id)) {
      req.session.visitedBlogs.push(req.params.id);
    }

    res.render('single-blog', { blog });
  } catch (error) {
    res.status(500).send('Error fetching blog');
  }
});

module.exports = router;

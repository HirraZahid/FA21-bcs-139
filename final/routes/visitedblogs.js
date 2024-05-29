const express = require('express');
const Blog = require('./models/blogs-model'); // Adjust the path as necessary

const router = express.Router();

router.get('/visited-blogs', async (req, res) => {
  try {
    if (!req.session.visitedBlogs || req.session.visitedBlogs.length === 0) {
      return res.render('visited-blogs', { blogs: [] });
    }

    const visitedBlogs = await Blog.find({ '_id': { $in: req.session.visitedBlogs } });
    res.render('visited-blogs', { blogs: visitedBlogs });
  } catch (error) {
    res.status(500).send('Error fetching visited blogs');
  }
});

module.exports = router;

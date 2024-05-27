const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  authorName: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  }
}, { collection: 'blogs_data' }); // Specify the collection name here

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;

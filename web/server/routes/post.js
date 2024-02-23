// routes/posts.js

var express = require('express');
var router = express.Router();
var Post = require('../models/Post');
var Comment = require('../models/Comment'); // Adjust the path according to your structure

var authenticate = require('../middleware/authenticate'); // Import your authentication middleware
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
// Route to fetch all posts
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Get the page from query parameter or default to 1
    const limit = parseInt(req.query.limit) || 10; // Set the limit of items per page
    const skip = (page - 1) * limit; // Calculate the number of items to skip

    const posts = await Post.find()
                            .populate('author', 'username')
                            .sort({ createdAt: -1 }) // Sort posts by creation date
                            .skip(skip)
                            .limit(limit);

    const totalPosts = await Post.countDocuments(); // Get the total number of posts

    res.status(200).json({
      posts,
      totalPages: Math.ceil(totalPosts / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Route to create a new post
// Assume 'authenticate' is your middleware to verify the token
// routes/posts.js
router.post('/', authenticate, upload.single('image'), async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).send('Authentication failed. User information is missing.');
    }

    let post = new Post({
      author: req.user._id, // Use req.user._id instead of req.user.userId
      title: req.body.title,
      content: req.body.content,
      image: req.file ? req.file.path : null,
    });

    await post.save();
    res.status(201).json(post);
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(400).json({ message: error.message });
  }
});


// Assuming you have a middleware to authenticate and set req.user
router.put('/:postId', authenticate, async (req, res) => {
  try {
      const post = await Post.findById(req.params.postId);

      if (!post) {
          return res.status(404).send('Post not found');
      }

      // Check if the logged-in user is the author of the post
      if (post.author.toString() !== req.user._id.toString()) {
          return res.status(401).send('Unauthorized');
      }

      // Update the post with new data
      post.title = req.body.title || post.title;
      post.content = req.body.content || post.content;
      // Handle other fields like image if necessary

      await post.save();
      res.status(200).json(post);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});
router.put('/comments/:commentId', authenticate, async (req, res) => {
  try {
    let comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).send('Comment not found');
    }

    // Allow admins or the original author to edit the comment
    if (comment.author.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(401).send('Unauthorized');
    }

    comment.content = req.body.content;
    await comment.save();

    // Repopulate the comment with the author's information after saving
    // Note: The 'execPopulate' method was used in previous examples but is not needed with recent Mongoose versions
    comment = await Comment.findById(comment._id).populate('author', 'username');

    res.status(200).json(comment);
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).json({ message: error.message });
  }
});



router.post('/:postId/comments', authenticate, async (req, res) => {
  console.log('Authenticated user ID:', req.user._id); // Check the user ID
  console.log('Request body:', req.body); // Inspect the request body

  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).send('Post not found');

    let comment = new Comment({
      content: req.body.content,
      author: req.user._id,
      post: req.params.postId
    });

    await comment.save();

    // After saving, log the comment to check if the author information is present
    console.log('Saved comment:', comment);

    comment = await Comment.findById(comment._id).populate('author', 'username');

    // Log the populated comment
    console.log('Populated comment:', comment);

    post.comments.push(comment._id);
    await post.save();

    res.status(201).json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});






router.get('/:postId/comments', async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
                                  .populate('author', 'username'); // Only if you want to show author info

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get('/search', async (req, res) => {
  try {
      const searchTerm = req.query.term || ''; // Ensure searchTerm is a string
      const regex = new RegExp(searchTerm, 'i'); // Create a RegExp for case-insensitive matching

      const posts = await Post.find({
          $or: [
              { title: { $regex: regex } },
              { content: { $regex: regex } }
          ]
      }).populate('author', 'username');
      
      res.status(200).json(posts);
  } catch (error) {
      console.error('Error occurred during search:', error);
      res.status(500).json({ message: error.message });
  }
});



// Assuming you have Comment model and authenticate middleware set up
router.delete('/:postId', authenticate, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).send('Post not found');
    }

    if (post.author.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(401).send('Unauthorized');
    }

    // Delete all comments associated with the post
    await Comment.deleteMany({ post: req.params.postId });

    // Use findByIdAndDelete instead of remove
    await Post.findByIdAndDelete(req.params.postId);

    res.status(200).send('Post and associated comments deleted');
  } catch (error) {
    console.error('Error occurred during post deletion:', error);
    res.status(500).json({ message: error.message });
  }
});
router.post('/:postId/upvote', authenticate, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).send('Post not found');
    }

    // Check if the user has already voted
    const voteIndex = post.votes.findIndex(vote => vote.user.toString() === req.user._id.toString());

    if (voteIndex !== -1) {
      // User has voted, update their vote
      post.votes[voteIndex].value = 1;
    } else {
      // User hasn't voted, add new vote
      post.votes.push({ user: req.user._id, value: 1 });
    }

    await post.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to downvote a post
router.post('/:postId/downvote', authenticate, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).send('Post not found');
    }

    // Check if the user has already voted
    const voteIndex = post.votes.findIndex(vote => vote.user.toString() === req.user._id.toString());

    if (voteIndex !== -1) {
      // User has voted, update their vote
      post.votes[voteIndex].value = -1;
    } else {
      // User hasn't voted, add new vote
      post.votes.push({ user: req.user._id, value: 1 });
    }

    await post.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Route to upvote a comment
router.post('/comments/:commentId/upvote', authenticate, async (req, res) => {
  try {
      const comment = await Comment.findById(req.params.commentId);
      if (!comment) {
          return res.status(404).send('Comment not found');
      }

      // Check if the user has already voted
      const existingVote = comment.votes.find(vote => vote.user.toString() === req.user._id.toString());

      if (existingVote) {
          // If user has already voted, update the vote if it's not an upvote
          if (existingVote.value !== 1) {
              existingVote.value = 1;
              await comment.save();
          }
      } else {
          // If user hasn't voted, add a new upvote
          comment.votes.push({ user: req.user._id, value: 1 });
          await comment.save();
      }

      res.status(200).json(comment);
  } catch (error) {
      console.error('Error upvoting comment:', error);
      res.status(500).json({ message: error.message });
  }
});

// Route to downvote a comment
router.post('/comments/:commentId/downvote', authenticate, async (req, res) => {
  try {
      const comment = await Comment.findById(req.params.commentId);
      if (!comment) {
          return res.status(404).send('Comment not found');
      }

      // Check if the user has already voted
      const existingVote = comment.votes.find(vote => vote.user.toString() === req.user._id.toString());

      if (existingVote) {
          // If user has already voted, update the vote if it's not a downvote
          if (existingVote.value !== -1) {
              existingVote.value = -1;
              await comment.save();
          }
      } else {
          // If user hasn't voted, add a new downvote
          comment.votes.push({ user: req.user._id, value: -1 });
          await comment.save();
      }

      res.status(200).json(comment);
  } catch (error) {
      console.error('Error downvoting comment:', error);
      res.status(500).json({ message: error.message });
  }
});







// Add other routes as needed for updating or deleting posts

module.exports = router;

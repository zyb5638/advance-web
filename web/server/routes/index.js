var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/search', async (req, res) => {
  const searchTerm = req.query.term; // Get the search term from query parameters

  try {
    // Perform search logic, for example using MongoDB's text search or a simple filter
    // This is a basic example using a hypothetical 'posts' collection
    const results = await posts.find({ $text: { $search: searchTerm } }).toArray();
    res.status(200).json(results);
  } catch (error) {
    res.status(500).send(error.message);
  }
});
module.exports = router;

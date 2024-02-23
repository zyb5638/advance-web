// models/Post.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const VoteSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  value: { type: Number, required: true },
});
const PostSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Set required to true
  title: { type: String, required: true },
  content: { type: String, required: true },
  votes: [VoteSchema],
comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
,
  image: { type: String }, // Path to the image
}, { timestamps: true }); // Enable automatic handling of createdAt and updatedAt


module.exports = mongoose.model('Post', PostSchema);

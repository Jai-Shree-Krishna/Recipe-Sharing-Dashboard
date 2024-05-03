import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  time: {
    type: Date,
    default: Date.now()
  },
  repliedTo: {
    type: String,
    enum: ['recipe', 'user'],
    required: true
  },
  _from: {
    type: String,
    ref: 'User',
    required: true
  },
  _to: {
    type: mongoose.Schema.Types.ObjectId,
  }
});
const Comment = mongoose.model('Comment', commentSchema);
export default Comment;
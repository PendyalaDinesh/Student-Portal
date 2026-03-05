// Week 7 — Direct message model
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  conversation: { type: String, required: true, index: true }, // sorted userId pair
  sender:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  post:     { type: mongoose.Schema.Types.ObjectId, ref: 'Post', default: null },
  text:     { type: String, required: true, maxlength: 2000, trim: true },
  read:     { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);

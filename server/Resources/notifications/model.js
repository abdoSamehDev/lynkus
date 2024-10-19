const mongoose = require('mongoose');

const notificationsSchema = new mongoose.Schema({
 
  to: { type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true
 },
  from: { type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true
 },
 post: { type: mongoose.Schema.Types.ObjectId, 
    ref: 'Post', 
    required: false 
 },
 comment: { type: mongoose.Schema.Types.ObjectId, 
    ref: 'Comment',  
    required: false 
 },
    type: { type: String, enum: ['FOLLOW', 'LIKE', 'COMMENT','POST'], required: true },
  content: { type: String, required: true },
  read: { type: Boolean, default: false },
  }

  , { timestamps: true }

);

module.exports = mongoose.model('Notifications', notificationsSchema);

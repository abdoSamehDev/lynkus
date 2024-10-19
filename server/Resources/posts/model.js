// this is the model

const mongoose = require('mongoose');

const { Schema } = mongoose;

const postSchema = new Schema({
    image: String,
    body: { type: String, required: true },
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
});

postSchema.index({ body: 'text' });

module.exports = mongoose.model('Post', postSchema);

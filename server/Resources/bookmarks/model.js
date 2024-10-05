// this is the model
const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({


    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    tags:[{
        type: String,
        
    }]
},
    {timestamps: true}
);

// create a model using the schema

module.exports = mongoose.model('Bookmark', bookmarkSchema);







// this is the model
const mongoose = require('mongoose');

const bcrypt= require('bcrypt');

const userSchema = new mongoose.Schema({
    
    name: {
        type: String,
        required: [true," name Required"],
        unique: true,
        lowercase: true,
        

    },
    userName: {
        type: String,
        required: [true," name Required"],
        
        lowercase: true,
    },
    email: {
        type: String,
        required: [true,"email required"],
        unique: true,
        lowercase: true,
        
    },
    
    profileImg:String,

    password: {
        type: String,
        required: [true," password Required"],
        minlength: [6," password is too short"],
        select: false,

    },
    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified: Boolean,
    
   
    resetToken: String,
    resetTokenExpiration: Date,
},
    {timestamps: true}
);
//Virtual Properties for Get Posts To User Profile 
userSchema.virtual('posts', {
    ref: 'Post',
    foreignField: 'user',
    localField: '_id',
  });

//For Hashing Password Before Save Into Database
userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 10);

    this.passwordChangedAt = Date.now() - 1000;

    next();
});

const setProfileImageURL = (doc) => {
    if (doc.profileImg) {
      const imageUrl = `${process.env.BASE_URI}/users/${doc.profileImg}`;
      doc.profileImg = imageUrl;
    }
  };
  // findOne, findAll
  userSchema.post('init', (doc) => {
    setProfileImageURL(doc);
  });
  
  // create and update
  userSchema.post('save', (doc) => {
    setProfileImageURL(doc);
  });
  


module.exports = mongoose.model('User', userSchema);

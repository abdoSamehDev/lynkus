// this is the model
const mongoose = require('mongoose');

const bcrypt= require('bcrypt');

const userSchema = new mongoose.Schema({
    
    name: {
        type: String,
        required: [true," name Required"],
        lowercase: true,
        

    },
    userName: {
        type: String,
        required: [true,"UserName Required"],
        unique: true,
        lowercase: true,
    },
    email: {
        type: String,
        required: [true,"email required"],
        unique: true,
        lowercase: true,
        
    },
    
    profileImg:String,
    headerImg:String,
    bio:String,


    password: {
        type: String,
        required: [true," password Required"],
        minlength: [6," password is too short"],
        select: false,

    },
    passwordChangedAt: {
      type:Date,
      select: false,
    },
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified: Boolean,
    
    
    resetToken: String,
    resetTokenExpiration: Date,

},
    {timestamps: true}

    
);

userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true });

//Virtual Properties for Get Posts To User Profile 
userSchema.virtual('posts', {
  ref: 'Post',
  foreignField: 'authorId',
  localField: '_id',
});


//For Hashing Password Before Save Into Database
userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next();
    
    //Hashing password
    this.password = await bcrypt.hash(this.password, 10);

    this.passwordChangedAt = Date.now() - 1000;

    next();
});

const setUserImagesURL = (doc) => {
    if (doc.profileImg) {
      const imageUrl = `${process.env.BASE_URI}/users/profileImg/${doc.profileImg}`;
      doc.profileImg = imageUrl;
    }
    else{
      doc.profileImg = `https://avatar.iran.liara.run/username?username=${doc.userName}&background=008080&color=F0F8FF&length=1`;
    }
    if (doc.headerImg) {
      const imageUrl = `${process.env.BASE_URI}/users/headerImg/${doc.headerImg}`;
      doc.headerImg = imageUrl;
    }
  };
  // findOne, findAll
  userSchema.post('init', (doc) => {
    setUserImagesURL(doc);
  });
  
  // create and update
  userSchema.post('save', (doc) => {
    setUserImagesURL(doc);
  });
  


module.exports = mongoose.model('User', userSchema);

const fs = require('fs');
const User= require('../Resources/users/model')

const cleanupTempImages = async(req) => {
  const  tempImages=req.tempImg

  if (req.tempImg) {
    // Check and delete profile image
    if (tempImages.profileImg) {
      if (fs.existsSync(tempImages.profileImg)) {
        try 
        {
          // Delete the profile image
          fs.unlinkSync(tempImages.profileImg); 
          await User.findByIdAndUpdate(
            req.user._id,
            { $set: { profileImg: null } },
            { new: true }
          )
          // console.log(`Deleted profile image: ${tempImages.profileImg}`);
        } catch (err) {
          console.error(`Error cleaning up profile image ${tempImages.profileImg}: ${err.message}`);
        }
      }
    }

    // Check and delete header image (if applicable)
    if (tempImages.headerImg) {
      if (fs.existsSync(tempImages.headerImg)) {
        try 
        {
           // Delete the header image
          fs.unlinkSync(tempImages.headerImg); 
          await User.findByIdAndUpdate(
            req.user._id,
            { $set: { headerImg: null } },
            { new: true }
          )
          console.log(`Deleted header image: ${tempImages.headerImg}`);
        } catch (err) {
          console.error(`Error cleaning up header image ${tempImages.headerImg}: ${err.message}`);
        }
      }
      
    }
  }
};

module.exports = { cleanupTempImages };

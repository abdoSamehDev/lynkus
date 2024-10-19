const {validationResult}=require('express-validator')
const {cleanupTempImages} =require('../utils/cleanupTempImages')
const validatorMiddleware=(req, res, next)=>{
    // validation middleware here
 
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        if (req.tempImg) {
            cleanupTempImages(req)
        }
        return res.status(400).json({errors:errors.array()})
    }
    next()

}
module.exports=validatorMiddleware;
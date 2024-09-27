const validationResult=require('express-validator')

const validatorMiddleware=(req, res, next)=>{
    // validation middleware here
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    next()

}
module.exports=validatorMiddleware;
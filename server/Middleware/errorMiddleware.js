const ApiError= require("../utils/apiError")

const globalError =(req,res,next,err)=>{

    err.statusCode = err.statusCode||500;
    err.status=err.status||"Error"

    //ssend for developer
    if (process.env.NODE_ENV==='development') {
        res.statusCode(err.statusCode).json({
            status:err.status,
            message:err.message,
            error:err,
            stack:err.stack,


        })
    }
    //send for Production
    else{

        if (err.name==="JsonWebTokenError"){
            err=new ApiError("invalid Token,Please login again",401)
        }
        if (err.name==="TokenExpiredError"){
            err=new ApiError("Expired Token,Please login again  ",401)
        }

        res.statusCode(err.statusCode).json({
            status:err.status,
            message:err.message,})
    }



}

module.exports=globalError;
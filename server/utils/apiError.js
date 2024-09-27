
// @des this about error can i predict 
class ApiError extends Error {

    constructor(message,statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status =`${statusCode}`.startsWith(4) ? 'fail' : 'error'; ;
        this.isOperational = true;
    }

}

module.exports = ApiError;
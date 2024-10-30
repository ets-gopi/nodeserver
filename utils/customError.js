class HttpError extends Error{
    constructor(status,message,options={}){
        super(message);

        //set the error name and status properties
        this.name=options.name || "HttpError";
        this.status=status;
        this.statusCode=status;

        //expose the error to the client if necessary.
        this.expose=options.expose || false;

        //expose the errors if necessary.
        options.error ? this.error=options.error : null;

        //// Capture the stack trace for better debugging
        Error.captureStackTrace(this,this.constructor);
    }
}

function createError(message,statusCode,options={}){
    console.log(options);
    
    const name=options.name || getErrorName(statusCode);

    return new HttpError(statusCode,message,{...options,name})

}

function getErrorName(status){

    const statusNames = {
        400: 'BadRequest',
        401: 'Unauthorized',
        403: 'Forbidden',
        404: 'NotFound',
        500: 'InternalServerError',
        409	:"Conflict"
    };
    return statusNames[status]
}


module.exports={HttpError,createError}


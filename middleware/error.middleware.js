const errorMiddleware = ( err , req , res , next ) => {

    // this middlw ware will check for errors . 
    
    try {
        let error = { ...err};
        error.message = err.message;
        console.log( err );

        // if Mongoose bad ObjectId
        if( err.name === "CastError"){
            const message = "Resource not found";
            error = new Error(message , 404);

        }

        //Mongoose duplicate ket
        if( err.code === 11000 ){
            const message = "Duplicate field value entered";
            error = new Error(message , 400);
        }
        //Mongoose validation error
        if( err.name === "ValidationError"){
            const message = Object.values(err.errors).map( val => val.message );
            error = new Error(message.join(', ') , 400);
        }

        res.status( error.statusCode || 500 ).json({
            success: false,
            message: error.message || "Server Error",
        });

    }
    catch(error) {
        next(error);
    }
};


export default errorMiddleware;
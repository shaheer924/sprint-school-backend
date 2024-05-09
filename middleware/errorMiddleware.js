const errorMiddleware = (err, req, res, next) => {
    let {message, statusCode} = err

    res.status(statusCode).json({
        message,
        success: false,
        stack: err.stack
    })
}

export default errorMiddleware
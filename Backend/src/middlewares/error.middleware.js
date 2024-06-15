module.exports = (err, req, res, next) => {
    if (err) {
        return res.status(err.statusCode || 500).send({ status: err.status || false, statusCode: err.statusCode || 500, message: err.message || "Internal Server Error" })
    }
    next()
}
module.exports = (req, res, next) => {
res.status(404).send({ status: false, statusCode: 404, message: "Path Not Found" })
}



const express = require("express")
const router = express.Router()

router.use("/user", require("./user"));
router.use("/teacher", require("./teacher"));
router.use("/student", require("./student"));
router.use("/admin", require("./admin"));

module.exports = router
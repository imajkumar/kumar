var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function(req, res) {
	res.send('API :')
});

module.exports = router;
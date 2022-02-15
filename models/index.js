const dbConfig = require("../config/config");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.Users = require("./user.model")(mongoose);
db.Profiles = require("./profile.model")(mongoose);
module.exports = db;
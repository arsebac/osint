const mongoose = require("mongoose");

const fbSchema = mongoose.Schema({
    phone: String,
    fb: String,
    firstname: String,
    lastname: String,
    sex: String,
    update_time: String,
    location: String,
    date: String,
    marital_status: String,
});

module.exports = mongoose.model("fb", fbSchema);

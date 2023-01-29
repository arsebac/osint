const mongoose = require("mongoose");

const DatabaseSchema = mongoose.Schema({
    website: String,
    web_name: String,
    url: String,
    number_of_users: Number,
    leak_date: Number
});

module.exports = mongoose.model("Database", DatabaseSchema);

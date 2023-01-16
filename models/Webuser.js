const mongoose = require("mongoose");
const crypto = require('crypto');

const WebuserSchema = mongoose.Schema({
    email: String,
    pwd: String,
    admin: Boolean
});

WebuserSchema.methods.verifyPassword = function (password, callback) {
    // Calcul du hash du mot de passe entré
    const passwordHash = crypto.createHash('sha256').update(password).digest('hex');

    // Comparaison du hash du mot de passe entré avec celui enregistré en base de données
    const isMatch = this.pwd === passwordHash;
    // Appel de la fonction de callback avec le résultat de la comparaison
    callback(null, isMatch);
};

module.exports = mongoose.model("Webuser", WebuserSchema);
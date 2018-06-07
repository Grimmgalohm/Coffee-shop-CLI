const mongoose = require('mongoose');

const coffeeSchema = mongoose.Schema({
    client:{type: String},
    coffeetype: {type: String, required: true},
    milktype: {type: String},
    ifcold: {type: Boolean},
    ifdecaf: {type: Boolean},
    created: {type: Date, default: Date.now}
});

const Coffee = mongoose.model('Coffee', coffeeSchema);

module.exports = Coffee;
const config = require('../config');
const logger = require('../logger')
const Mongoose = require('mongoose');

//Make a connection to the MongoDB
Mongoose.connect(config.dbURI, {useUnifiedTopology: true, useNewUrlParser: true});

// Log an error if the connection fails

Mongoose.connection.on('error', error => {
    logger.log('error', "Mongoose connection error: " + error)
})

// Create a Schema that defines the structure for storing user dara
const Schema = Mongoose.Schema
const chatUserSchema = new Schema({
    profileId: String,
    fullName: String,
    profilePic: String
});

//Turn the schema into usable model
let userModel = Mongoose.model('chatUser', chatUserSchema);


module.exports = {
    Mongoose,
    userModel
}
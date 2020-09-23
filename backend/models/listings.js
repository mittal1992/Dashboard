const mongoose = require('mongoose');

const listingSchema = mongoose.Schema({
    street: String,
    city: String,
    _id: String,
    zip: String,
    state: String,
    type: String,
    sale_date: Date,
    beds: Number,
    baths: Number,
    sq_ft: Number,
    price: Number,
    latitude: String,
    longitude: String
});

module.exports = mongoose.model('Listing', listingSchema);


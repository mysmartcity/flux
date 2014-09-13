'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var NewsSchema = new Schema({
    date : Date,
    category : String,
    url:String,
    title:String,
    content:String,
    msk:String
});

module.exports = mongoose.model('News', NewsSchema);
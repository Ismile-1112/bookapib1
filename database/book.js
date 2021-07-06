const mongoose = require("mongoose");

// Creating a book Schema
const BookSchema = mongoose.Schema({
    ISBN: String,
    title: String,
    authors: [Number],
    language: String,
    pubDate: String,
    numOfPage: Number,
    category: [string],
    publication: Number
});

// Create a book model
const BookModel = mongoose.model(BookSchema);

module.exports = BookModel;
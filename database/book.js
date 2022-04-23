const mongoose = require("mongoose");

// Creating a book Schema
const BookSchema = mongoose.Schema({
    ISBN: {
        type: String,
        required: true,
        minLength: 8,
        maxLength: 10,
    }, //required
    title: String,
    authors: [Number],
    language: String,
    pubDate: String,
    numOfPage: Number,
    category: [String],
    publication: Number
});

// Create a book model
const BookModel = mongoose.model("books", BookSchema);

module.exports = BookModel;

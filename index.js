require("dotenv").config();
// Frame Work
const express = require("express");
const mongoose = require("mongoose");

// Microservices Routes
const Books = require("./API/Book");
const Authors = require("./API/Author");
const Publications = require("./API/Publication");

// Initializing express
const shapeAI = express();

// Configurations
shapeAI.use(express.json());

// Establish Database Connection
mongoose.connect(
    process.env.MONGO_URL, 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    }
).then(() => console.log("Connection established!!"));


// Initializing Microservices
shapeAI.use("/book", Books);
shapeAI.use("/author", Authors);
shapeAI.use("/publication", Publications);



/*
  Route          /a
  Description    get specific books based on an author
  Access         Public
  Parameters     id
  Method         Get
 */

/*shapeAI.get("/a/:id", (req, res) => {
    const getSpecificBooks = database.books.filter(
        (book) => book.authors === parseInt(req.params.id)
    );

    if(getSpecificBooks.length === 0) {
        return res.json({ error: `No book found for the author of ${parseInt(req.params.id)}`
    });
    }

    return res.json({ book: getSpecificBooks });
}); */


shapeAI.listen(3000, () => console.log("Server Running!!")); 
require("dotenv").config();
// Frame Work
const express = require("express");
const mongoose = require("mongoose");

// Database
const database = require("./database/index");

// Models
const BookModel = require("./database/book");
const AuthorModel = require("./database/author");
const PublicationModel = require("./database/publication");

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

/*
  Route          /
  Description    get all books
  Access         Public
  Parameters     None
  Method         Get
 */
shapeAI.get("/", async (req, res) => {
    const getAllBooks = await BookModel.find();
    return res.json(getAllBooks);
});

/*
  Route          /is
  Description    get specific book based on isbn
  Access         Public
  Parameters     isbn
  Method         Get
 */
shapeAI.get("/is/:isbn", async (req, res) => {
    const getSpecificBook = await BookModel.findOne({ISBN: req.params.isbn}); 

    if(!getSpecificBook) {
        return res.json({ error: `No book found for the ISBN of ${req.params.isbn}`
    });
    }

    return res.json({ book: getSpecificBook });
});

/*
  Route          /c
  Description    get specific books based on a category
  Access         Public
  Parameters     Category
  Method         Get
 */

  shapeAI.get("/c/:category",async (req, res) => {
    const getSpecificBooks = await BookModel.findOne({
        category: req.params.category,
    });

    if(!getSpecificBooks) {
        return res.json({ error: `No book found for the category of ${req.params.category}`
    });
    }

    return res.json({ book: getSpecificBooks });
});

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

/*
  Route          /author
  Description    get all authors
  Access         Public
  Parameters     none
  Method         Get
 */

shapeAI.get("/author",async (req, res) => {
    const getAllAuthors = await AuthorModel.find();
    return res.json({ getAllAuthors });
});

/*
  Route          /author
  Description    to get specific author 
  Access         Public
  Parameters     id
  Method         Get
 */

shapeAI.get("/author/:id", async (req, res) => {
    const getSpecificAuthor = await AuthorModel.findOne({id: req.params.id});

    if(!getSpecificAuthor) {
        return res.json({ error: `No author found for the authors of ${req.params.id}`
    });
    }

    return res.json({ author: getSpecificAuthor });
}); 

/*
  Route          /author/is
  Description    get a list of authors based on a book's ISBN 
  Access         Public
  Parameters     isbn
  Method         Get
 */

shapeAI.get("/author/:is/:isbn", async (req, res) => {
    const getSpecificAuthors = await AuthorModel.findOne({ books: req.params.isbn})
    
    if(!getSpecificAuthors) {
        return res.json({
           error: `No author found for the book ${request.params.isbn}` 
        });
    }

    return res.json({ authors: getSpecificAuthors });
});

/*
  Route          /publications
  Description    get all publications
  Access         Public
  Parameters     None
  Method         Get
 */
shapeAI.get("/publications", async (req, res) => {
    const getAllPublications = await PublicationModel.find();
    return res.json({ getAllPublications });
});

//to get specific publication

/*
  Route          /publication
  Description    to get specific publication 
  Access         Public
  Parameters     id
  Method         Get
 */

  shapeAI.get("/publication/:id", async (req, res) => {
    const getSpecificPublication = await PublicationModel.findOne({id: req.params.id});

    if(!getSpecificPublication) {
        return res.json({ error: `No author found for the authors of ${req.params.id}`
    });
    }

    return res.json({ publication: getSpecificPublication });
}); 

/*
  Route          /publications
  Description    get a list of publications based on a book
  Access         Public
  Parameters     books
  Method         Get
 */

  shapeAI.get("/publications/:isbn", async (req, res) => {
    const getSpecificPublications = await PublicationModel.findOne({ books: req.params.isbn})

    if(!getSpecificPublications) {
        return res.json({ error: `No Publication found for the book of ${req.params.isbn}`
    });
    }

    return res.json({ Publication: getSpecificPublications });
});

/*
  Route          /book/new
  Description    add new books
  Access         Public
  Parameters     None
  Method         POST
 */

shapeAI.post("/book/new", (req, res) => {
    const { newBook } = req.body;
    
    BookModel.create(newBook);
    
    return res.json({ message: "book was added!" });
});

/*
  Route          /author/new
  Description    add new author
  Access         Public
  Parameters     None
  Method         POST
 */

  shapeAI.post("/author/new", (req, res) => {
    const { newAuthor } = req.body;

    AuthorModel.create(newAuthor);

    return res.json({ message: "author was added!" });
});

/*
  Route          /publication/new
  Description    add new publication
  Access         Public
  Parameters     None
  Method         POST
 */

  shapeAI.post("/publication/new", (req, res) => {
    const { newPublication } = req.body;

    PublicationModel.create(newPublication);

    return res.json({ message: "publication was added!" });
});

/*
  Route          /book/update
  Description    Update title of a book
  Access         Public
  Parameters     isbn
  Method         PUT
 */

shapeAI.put("/book/update/:isbn", (req, res) => {
   database.books.forEach((book) => {
       if (book.ISBN === req.params.isbn) {
           book.title = req.body.bookTitle;
           return;
       }
   });
   return res.json({ books: database.books });
});

/*
  Route          /book/author/update
  Description    Update/add new author
  Access         Public
  Parameters     isbn
  Method         PUT
 */

shapeAI.put("/book/author/update/:isbn", (req, res) => {
    // update the book database
    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn)
           return book.authors.push(req.body.newAuthor);
    });

    // update the author database
    database.authors.forEach((author) => {
        if (author.id === req.body.newAuthor)
           return author.books.push(req.params.isbn);
    });
    return res.json({
        books: database.books, 
        authors: database.authors,
        message: "New author was added",
    });
});

/*
  Route          /author/update
  Description    Update author name using id
  Access         Public
  Parameters     id
  Method         PUT
 */

  shapeAI.put("/author/update/:id", (req, res) => {
    database.authors.forEach((author) => {
        if (author.id === req.params.id) {
            author.name = req.body.authorName;
            return;
        }
    });
    return res.json({ Authors: database.authors });
 });

/*
  Route          /Publication/update
  Description    Update publication details using id
  Access         Public
  Parameters     id
  Method         PUT
 */

  shapeAI.put("/publication/update/:id", (req, res) => {
    database.publications.forEach((publication) => {
        if (publication.id === req.params.id) {
            publication.name = req.body.publicationName;
            return;
        }
    });
    return res.json({ Publications: database.publications });
 });

/*
  Route          /Publication/update/book
  Description    Update/add new book to a publication
  Access         Public
  Parameters     isbn
  Method         PUT
 */
shapeAI.put("/Publication/update/book/:isbn", (req, res) => {
   // update the publication database
   database.publications.forEach((publication) => {
      if (publication.id === req.body.pubId) {
          return publication.books.push(req.params.isbn);
      }
   });
   // update the book database
   database.books.forEach((book) => {
       if (book.ISBN === req.params.isbn) {
           book.publication = req.body.pubId;
           return;
       }
   });
   return res.json({
       books: database.books,
       publications: database.publications,
       message: "Successfully updated publication"
   });
});

/*
  Route          /book/delete
  Description    delete a book
  Access         Public
  Parameters     isbn
  Method         DELETE
 */
shapeAI.delete("/book/delete/:isbn", (req, res) => {
    const updatedBookDatabase = database.books.filter(
        (book) => book.ISBN !== req.params.isbn
    );
    database.books = updatedBookDatabase;
    return res.json({ books: database.books });
});

/*
  Route          /book/delete/author
  Description    delete an author from a book
  Access         Public
  Parameters     isbn, author id
  Method         DELETE
 */
shapeAI.delete("/book/delete/author/:isbn/:authorId", (req, res) => {
    // update the book database
    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn) {
            const newAuthorList = book.authors.filter(
                (author) => author !== parseInt(req.params.authorId)
            );
            book.authors = newAuthorList;
            return;
        }
    });

    // update the author database
    database.authors.forEach((author) => {
        if (author.id === parseInt(req.params.authorId)) {
            const newBooksList = author.books.filter(
                (book) => book !== req.params.isbn
            );
            author.books = newBooksList;
            return;
        }
    });
    return res.json({
        message: "author was deleted!!!",
        book: database.books,
        author: database.authors
    });
});

/*
  Route          /author/delete
  Description    delete an author
  Access         Public
  Parameters     id
  Method         DELETE
 */
  shapeAI.delete("/author/delete/:id", (req, res) => {
    const updatedAuthorDatabase = database.authors.filter(
        (author) => author.id !== parseInt(req.params.id)
    );
    database.authors = updatedAuthorDatabase;
    return res.json({ authors: database.authors });
});

/*
  Route          /publication/delete/book
  Description    delete a book from publication
  Access         Public
  Parameters     isbn, publication id
  Method         DELETE
 */
shapeAI.delete("/publication/delete/book/:isbn/:pubId", (req, res) => {
    //update publication database
    database.publications.forEach((publication) => {
        if (publication.id === parseInt(req.params.pubId)) {
            const newBooksList = publication.books.filter(
                (book) => book !== req.params.isbn
            );
            publication.books = newBooksList;
            return;
        }
    });
    
    // update book database
    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn){
            book.publication = 0;  // no publication available
            return;
        }
    });
    return res.json({
        books:database.books,
        publications: database.publications
    })
});

/*
  Route          /publication/delete
  Description    delete a publication
  Access         Public
  Parameters     id
  Method         DELETE
 */
  shapeAI.delete("/publication/delete/:id", (req, res) => {
    const updatedPublicationDatabase = database.publications.filter(
        (publication) => publication.id !== parseInt(req.params.id)
    );
    database.publications = updatedPublicationDatabase;
    return res.json({ publications: database.publications });
});


shapeAI.listen(3000, () => console.log("Server Running!!")); 
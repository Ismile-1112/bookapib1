const Router = require("express").Router();

const PublicationModel = require("../../database/publication");

/*
  Route          /publications
  Description    get all publications
  Access         Public
  Parameters     None
  Method         Get
 */
  Router.get("/", async (req, res) => {
    const getAllPublications = await PublicationModel.find();
    return res.json({ getAllPublications });
});

/*
  Route          /publication
  Description    to get specific publication 
  Access         Public
  Parameters     id
  Method         Get
 */

Router.get("/:id", async (req, res) => {
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

Router.get("/:isbn", async (req, res) => {
    const getSpecificPublications = await PublicationModel.findOne({ books: req.params.isbn})

    if(!getSpecificPublications) {
        return res.json({ error: `No Publication found for the book of ${req.params.isbn}`
    });
    }

    return res.json({ Publication: getSpecificPublications });
});

/*
  Route          /publication/new
  Description    add new publication
  Access         Public
  Parameters     None
  Method         POST
 */

Router.post("/new", (req, res) => {
    const { newPublication } = req.body;

    PublicationModel.create(newPublication);

    return res.json({ message: "publication was added!" });
});


/*
  Route          /Publication/update
  Description    Update publication details using id
  Access         Public
  Parameters     id
  Method         PUT
 */

Router.put("/update/:id", async (req, res) => {

    const updatedPublication = await PublicationModel.findOneAndUpdate(
      {
        id: req.params.id,
      },
      {
        name: req.body.publicationName,
      },
      {
        new: true
      }
    );

    // database.publications.forEach((publication) => {
    //     if (publication.id === req.params.id) {
    //         publication.name = req.body.publicationName;
    //         return;
    //     }
    // });
    return res.json({ Publications: updatedPublication });
 });

/*
  Route          /Publication/update/book
  Description    Update/add new book to a publication
  Access         Public
  Parameters     isbn
  Method         PUT
 */
Router.put("/update/book/:isbn", async (req, res) => {
   // update the publication database

  const updatePublication = await PublicationModel.findOneAndUpdate(
    {
      id: req.body.pubId,
    },
    {
      $addToSet: {
        books: req.params.isbn,
      },
    },
    {
      new: true
    }
  );

  //  database.publications.forEach((publication) => {
  //     if (publication.id === req.body.pubId) {
  //         return publication.books.push(req.params.isbn);
  //     }
  //  });

   // update the book database

  const updatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN: req.params.isbn,
    },
    {
      publication: req.body.pubId,
    },
    {
      new: true
    }
  );

  //  database.books.forEach((book) => {
  //      if (book.ISBN === req.params.isbn) {
  //          book.publication = req.body.pubId;
  //          return;
  //      }
  //  });
   return res.json({
       books: updatedBook,
       publications: updatePublication,
       message: "Successfully updated publication"
   });
});



/*
  Route          /publication/delete/book
  Description    delete a book from publication
  Access         Public
  Parameters     isbn, publication id
  Method         DELETE
 */
Router.delete("/delete/book/:isbn/:pubId", async (req, res) => {
    //update publication database

    const updatedPublication = await PublicationModel.findOneAndUpdate(
      {
        id: parseInt(req.params.pubId),
      },
      {
        $pull: {
          books: req.params.isbn,
        },
      },
      {
        new: true
      }
    );

    // database.publications.forEach((publication) => {
    //     if (publication.id === parseInt(req.params.pubId)) {
    //         const newBooksList = publication.books.filter(
    //             (book) => book !== req.params.isbn
    //         );
    //         publication.books = newBooksList;
    //         return;
    //     }
    // });
    
    // update book database

    const updatedBook = await BookModel.findOneAndUpdate(
      {
        ISBN: req.params.isbn,
      },
    );

    // database.books.forEach((book) => {
    //     if (book.ISBN === req.params.isbn){
    //         book.publication = 0;  // no publication available
    //         return;
    //     }
    // });
    return res.json({
        books:updatedBook,
        publications: updatedPublication
    })
});

/*
  Route          /publication/delete
  Description    delete a publication
  Access         Public
  Parameters     id
  Method         DELETE
 */
Router.delete("/delete/:id", async (req, res) => {

    const updatedPublicationDatabase = await PublicationModel.findOneAndDelete({
      id: parseInt(req.params.id),
    });

    // const updatedPublicationDatabase = database.publications.filter(
    //     (publication) => publication.id !== parseInt(req.params.id)
    // );
    // database.publications = updatedPublicationDatabase;
    return res.json({ publications: updatedPublicationDatabase });
});

module.exports = Router;
const Router = require("express").Router();

const AuthorModel = require("../../database/author");

/*
  Route          /author
  Description    get all authors
  Access         Public
  Parameters     none
  Method         Get
 */

Router.get("/",async (req, res) => {
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

Router.get("/:id", async (req, res) => {
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

Router.get("/:is/:isbn", async (req, res) => {
    const getSpecificAuthors = await AuthorModel.findOne({ books: req.params.isbn})
    
    if(!getSpecificAuthors) {
        return res.json({
           error: `No author found for the book ${request.params.isbn}` 
        });
    }

    return res.json({ authors: getSpecificAuthors });
});

/*
  Route          /author/new
  Description    add new author
  Access         Public
  Parameters     None
  Method         POST
 */

Router.post("/new", (req, res) => {
    const { newAuthor } = req.body;

    AuthorModel.create(newAuthor);

    return res.json({ message: "author was added!" });
});

/*
  Route          /author/update
  Description    Update author name using id
  Access         Public
  Parameters     id
  Method         PUT
 */

Router.put("/update/:id", async (req, res) => {

    const updatedAuthor = await AuthorModel.findOneAndUpdate(
      {
        id: req.params.id,
      },
      {
        name: req.body.authorName,
      },
      {
        new: true
      }
    );

    // database.authors.forEach((author) => {
    //     if (author.id === req.params.id) {
    //         author.name = req.body.authorName;
    //         return;
    //     }
    // });
    return res.json({ Authors: updatedAuthor });
 });

 /*
  Route          /author/delete
  Description    delete an author
  Access         Public
  Parameters     id
  Method         DELETE
 */
Router.delete("/delete/:id", async (req, res) => {

    const updatedAuthorDatabase = await AuthorModel.findOneAndDelete({
      id: parseInt(req.params.id),
    });

    // const updatedAuthorDatabase = database.authors.filter(
    //     (author) => author.id !== parseInt(req.params.id)
    // );
    // database.authors = updatedAuthorDatabase;
    return res.json({ authors: updatedAuthorDatabase });
});

module.exports = Router;

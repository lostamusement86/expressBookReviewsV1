const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// Start Task 10
// get all books (async)
function retrieveBooks() {
  return new Promise((resolve, reject) => {
    resolve(books);
  });
} // end Task 10

// Start Task 11
// filter all books by ISBN (async)
function filterByISBN(isbn){
  return new Promise((resolve, reject) => {
    let isbnNum = parseInt(isbn);
    if(books[isbnNum]) {
      resolve(books[isbnNum]);
    } else {
      reject({
        "status": 404,
        "message": `ISBN [${isbn}]: not found!`,
      });
    }
  });
} // End Task 11


// Start Task 6
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  
  if(username && password){
    if(!isValid(username)){
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered. You may now login."});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: `Unable to register ${username}. Either username or password was invalid or not given.`});
}); // End Task 6

// Start Task 1
// Get the book list available in the shop
public_users.get('/',function (req, res) {
  retrieveBooks().then((allBooks) => {
    res.send(JSON.stringify(allBooks))
  }); // Updated for Task 11
}); // End Task 1

// Start Task 2
// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  filterByISBN(req.params.isbn).then(
      result => res.send(JSON.stringify(result)),
      error => res.status(error.statusCode).json({message: error.message})
  ); // Updated for Task 12
 }); // End Task 2

// Start Task 3
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  retrieveBooks().then((allBooks) => Object.values(allBooks)).then(
      (bookObjects) => bookObjects.filter((book) => book.author === author)).then(
          filteredBooks => res.send(JSON.stringify(filteredBooks))
  ); // Updated for Task 13
}); // End Task 3

// Start Task 4
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  retrieveBooks().then((allBooks) => Object.values(allBooks)).then(
      (bookObjects) => bookObjects.filter((book) => book.title === title)).then(
      filteredBooks => res.send(JSON.stringify(filteredBooks))
  ); // Updated to match Tasks 11-13
}); // End Task 4

// Start Task 5
//  Get book review by ISBN
public_users.get('/review/:isbn',function (req, res) {
  filterByISBN(req.params.isbn).then(
      result => res.send(JSON.stringify(result.reviews)),
      error => res.status(error.statusCode).json({message: error.message})
  );
}); // End Task 5

module.exports.general = public_users;

const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

/*
 users has been prepopulated with dummy accounts. In production this would be stored in a different manner.
 */
let users = [
  {
    username: "admin",
    password: "superSecret"
  },
  {
    username: "test1",
    password: "pwd1"
  },
  {
    username: "test2",
    password: "pwd2"
  },
  {
    username: "test3",
    password: "pwd3"
  },
];

const isValid = (username)=>{ //returns boolean
  let usersWithSameName = users.filter((user)=>{
    return user.username === username;
  });
  return usersWithSameName.length > 0;
}

const authenticateUser = (username,password)=>{
  let validUsers = users.filter((user)=>{
    return (user.username === username && user.password === password);
  });
  return (validUsers.length > 0);
}

// Start Task 7
// only registered users can log in
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if(!username || !password){
    return res.status(404).json({message: "Invalid Login. Please check that username and password are correct."})
  }
  if(authenticateUser(username,password)){
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60});

    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("User successfully logged in.")
  } else {
    return res.status(208).json({message: "Invalid Login. Please check username and password."})
  }
}); // End Task 7

// Start Task 8
// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const user = req.session.authorization.username;
  let book = books[isbn];

  if (book) {
    book.reviews[user] = review; // will create or replace the book's review for given user
    return res.status(200).send("User review posted successfully!")
  } else {
    return res.status(403).json({message: "User must be logged in to review."})
  }
}); // End Task 8

// Start Task 9
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const user = req.session.authorization.username;

  if (books[isbn]) {
    let book = books[isbn];
    delete book.reviews[user];
    return res.status(200).send("User review deleted successfully!");
  } else {
    return res.status(404).send({message: `ISBN ${isbn} not found!`});
  }
}); //  End Task 9

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

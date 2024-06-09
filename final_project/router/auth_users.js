const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  let usersWithSameName = users.filter((user)=>{
    return user.username === username;
  });

  return usersWithSameName.length > 0;
}

const authenticatedUser = (username,password)=>{ //returns boolean
  let validUsers = users.filter((user)=>{
    return (user.username === username && user.password === password);
  });
  return (validUsers.length > 0);
}

// only registered users can log in
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if(!username || !password){
    return res.status(404).json({message: "Invalid Login. Please check that username and password are correct."})
  }
  if(authenticatedUser(username,password)){
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
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

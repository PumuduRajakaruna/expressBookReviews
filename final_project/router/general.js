const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const registeredUsers = []; 


public_users.post("/register", (req,res) => {
  //Write your code here
  // Extracting 'username' and 'password' from the request body
  const { username, password } = req.body;

  // Checking if both 'username' and 'password' are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Both username and password are required." });
  }

  // Checking if the username already exists
  if (registeredUsers.some(user => user.username === username)) {
    return res.status(409).json({ message: "Username already exists. Please choose a different one." });
  }

  // If everything is valid, add the user to the registeredUsers array (this is a simple example; in a real application, you would likely store user data securely)
  registeredUsers.push({ username, password });

  // Returning a success message
  return res.status(201).json({ message: "User registered successfully." });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify({books},null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const requestedISBN = req.params.isbn;

  if (books[requestedISBN]) {
    const book = books[requestedISBN];
    
    res.send(book);
  } else {
    res.status(404).send('Book not found');
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const requestedAuthor = req.params.author;

  // Obtain all the keys for the 'books' object
  const bookKeys = Object.keys(books);

  // Iterate through the 'books' array & check if the author matches the one provided in the request parameters
  const matchingBooks = bookKeys
    .map((key) => books[key])
    .filter((book) => book.author === requestedAuthor);

  if (matchingBooks.length > 0) {
    res.send(matchingBooks);
  } else {
    res.status(404).send('Books by the author not found');
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const requestedTitle = req.params.title;

  // Convert the values of the books object into an array
  const booksArray = Object.values(books);

  let filtered_books = booksArray.filter((book) => book.title === requestedTitle);

  if (filtered_books.length > 0) {
    res.send(filtered_books);
  } else {
    res.status(404).send('Book not found');
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const requestedISBN = req.params.isbn;

  // Check if the requested ISBN exists in the books object
  if (books[requestedISBN]) {
    const bookReviews = books[requestedISBN].reviews;
    
    res.send(bookReviews);
  } else {
    res.status(404).send('Book not found');
  }
});

module.exports.general = public_users;

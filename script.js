"use strict";

const btnAddNewBook = document.querySelector(".btn--add");
const bookModal = document.querySelector("dialog");
const btnSubmitModal = document.querySelector(".btn--modal");

btnAddNewBook.addEventListener("click", e => {
  bookModal.showModal();
});

btnSubmitModal.addEventListener("click", e => {});

// BOOK CLASS
const Book = function (title, author, pages, readStatus) {
  if (!new.target) {
    console.error("Use the new keyword when calling this function!");
  }

  // TODO: add error handle for pages
  console.log();

  if (!(typeof title === "string") || !(typeof author === "string") || !Number.isFinite(pages)) {
    console.log("Input is not valid");
    return;
  }

  this.title = title;
  this.author = author;
  this.pages = pages;
  this.readStatus = readStatus;
};

// APP class
const App = function () {
  this.library = [];

  // Display books on page load
  this._displayBooks();
};

App.prototype._displayBooks = function () {};

App.prototype.addNewBook = function (book) {
  if (book instanceof Book) this.library.push(book);
  return this;
};

App.prototype._getBookHtml = function (book) {
  console.log(book instanceof Book);
  return `

  `;
};

// MAIN CODE
const app = new App();

// DUMMY DATA
const book1 = new Book("The Lost Ocean", "Jane Doe", 245, false);
const book2 = new Book("Time and Space", "John Smith", 312, true);
const book3 = new Book("Shadows in the Dark", 180, false);
const book4 = new Book("The Last Recipe", "Alan Cook", 410, false);
app.addNewBook(book1).addNewBook(book2).addNewBook(book3).addNewBook(book4);

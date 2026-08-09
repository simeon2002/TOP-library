"use strict";

const btnAddNewBook = document.querySelector(".btn--add");
const bookModal = document.querySelector("dialog");
const btnSubmitModal = document.querySelector(".btn--modal");
const bookForm = document.querySelector("form");

// BOOK CLASS
const Book = function (title, author, pages, readStatus) {
  if (!new.target) {
    console.error("Use the new keyword when calling this function!");
  }

  // TODO: add error handle for pages
  console.log();

  if (
    !(typeof title === "string") ||
    title.length === 0 ||
    !Number.isNaN(Number(title)) ||
    !(typeof author === "string") ||
    author.length === 0 ||
    !Number.isNaN(Number(author))
  ) {
    console.error("Input is not valid");
    console.log(typeof title, typeof author, Number.isFinite(pages));

    return;
  }

  this.bookId = crypto.randomUUID();
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.readStatus = readStatus;
};

// APP CLASS
const App = function () {
  this.library = [];

  // Display books on page load
  this._displayBooks();

  // Display form on add new button click
  btnAddNewBook.addEventListener("click", this._displayForm);

  // Submission of form
  bookForm.addEventListener("submit", e => {
    e.preventDefault();

    // fetch form data
    let [bookTitle, bookAuthor, bookPages, readStatus] = [...new FormData(bookForm).values()];
    readStatus = readStatus === "on" ? true : false;
    bookPages = Number(bookPages);
    bookPages = Number.isFinite(bookPages) ? bookPages : 0;

    // create book element
    const book = new Book(bookTitle, bookAuthor, bookPages, readStatus);
    console.log(book);

    if (Object.keys(book).length !== 0) {
      // store book
      this.addNewBook(book);

      // Add book to book list
      this._displayBooks();

      // reset bookForm
      bookForm.reset();

      // close book modal form
      bookModal.close();
    } else {
      alert("Please provide valid information in the input fields!");
    }
  });
};

App.prototype._isLibEmpty = function (library) {
  return this.library.length === 0;
};

App.prototype._displayBooks = function () {
  let html;
  const formBody = document.querySelector(".table tbody");

  if (this._isLibEmpty() === false) html = this.library.map(this._getBookHtml).join("");
  else html = "No books found yet. Add Some!";

  formBody.innerHTML = "";
  formBody.insertAdjacentHTML("afterbegin", html);
};

App.prototype.addNewBook = function (book) {
  if (book instanceof Book) this.library.push(book);
  return this;
};

App.prototype._getBookHtml = function (book) {
  console.log(book instanceof Book);
  return `
    <tr class="book" data-book-id="${book.bookId}">
      <td class="book__title">${book.title}</td>
      <td class="book__author">${book.author}</td>
      <td class="book__pages">${book.pages}</td>
      <td class="book__read-status">
        <input class="checkbox" type="checkbox" ${book.readStatus ? "checked" : ""} />
      </td>
      <td class="book__remove">
        <button class="btn--remove">
          <ion-icon name="close-outline"></ion-icon>
        </button>
      </td>
    </tr>
  `;
};

App.prototype._displayForm = function () {
  console.log("test");
  console.log(this);

  bookModal.showModal();
};

// MAIN CODE
// DUMMY DATA
const book1 = new Book("The Lost Ocean", "Jane Doe", 245, false);
const book2 = new Book("Time and Space", "John Smith", 312, true);
const book3 = new Book("Shadows in the Dark", "Emily White", 180, false);
const book4 = new Book("The Last Recipe", "Alan Cook", 410, false);

const app = new App();
// Add books
app.addNewBook(book1).addNewBook(book2).addNewBook(book3).addNewBook(book4);
// render books (here for now, move to constructor function later when you store them in local storage as well!)
app._displayBooks();

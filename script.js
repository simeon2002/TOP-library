"use strict";

const btnsAddNewBook = document.querySelectorAll(".btn--add");
const btnSubmitModal = document.querySelector(".btn--modal");
const btnCardDisplay = document.querySelector(".btn--card");

const bookModal = document.querySelector("dialog");
const bookForm = document.querySelector("form");
const tableBody = document.querySelector(".table tbody");

// BOOK CLASS
const Book = function (title, author, pages, readStatus, bookId) {
  if (!new.target) {
    console.error("Use the new keyword when calling this function!");
  }

  // TODO: add error handle for pages
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

  this.bookId = bookId ?? crypto.randomUUID();
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.readStatus = readStatus;
};

Book.prototype.toggleReadStatus = function () {
  this.readStatus = !this.readStatus;
};

// APP CLASS
const App = function (defaultDisplayMode = "table") {
  // this.library = [
  //   new Book("The Lost Ocean", "Jane Doe", 245, false),
  //   new Book("Time and Space", "John Smith", 312, true),
  //   new Book("Shadows in the Dark", "Emily White", 180, false),
  //   new Book("The Last Recipe", "Alan Cook", 410, false),
  // ];

  // set library var
  this.library =
    this._fetchFromLocalStorage("library")?.map(book => new Book(book.title, book.author, book.pages, book.readStatus, book.bookId)) ?? [];

  // set initial display mode
  this.displayMode = defaultDisplayMode;

  // Display books on page load
  this._displayBooks(this.displayMode);

  // Display form on add new button click
  btnsAddNewBook.forEach(btnAdd => btnAdd.addEventListener("click", this._displayForm));

  // Submission of form
  bookForm.addEventListener("submit", this._addNewBook.bind(this));

  // Remove book event listener
  tableBody.addEventListener("click", this._removeBook.bind(this));

  // Toggle read status
  tableBody.addEventListener("click", this._toggleReadStatus.bind(this));

  // swtich to card display mode
  btnCardDisplay.addEventListener("click", e => {});
};

App.prototype._isLibEmpty = function (library) {
  return this.library.length === 0;
};

App.prototype._displayBooks = function (displayFormat = "table") {
  let html;
  if (this._isLibEmpty() === false) html = this.library.map(book => this._getBookHtml(book, displayFormat)).join("");
  else html = "No books found yet. Add Some!";

  tableBody.innerHTML = "";
  tableBody.insertAdjacentHTML("afterbegin", html);
};

App.prototype._addNewBook = function (e) {
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
    if (book instanceof Book) this.library.push(book);
    else return;

    // Add book to book list
    this._displayBooks();

    // reset bookForm
    bookForm.reset();

    // close book modal form
    bookModal.close();

    // store to local storage
    this._storeToLocalStorage("library", this.library);
  } else {
    alert("Please provide valid information in the input fields!");
  }
  return this;
};

App.prototype._getBookHtml = function (book, displayFormat = "table") {
  if (displayFormat === "table")
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

  if (displayFormat === "card")
    return `
    <article class="card" data-book-id=${book.bookId}>
      <!-- TODO: CAN BE ADDED TOGETHER WITH IMAGE UPLOAD SUPPORT <img src="" alt=""> -->
      <h2 class="card__book-title">${book.title}</h2>
      <ul class="card__list card__book-details">
        <li class="card__list-item card__author"><span>Author</span> <span Cook>${book.author}</span></li>
        <li class="card__list-item card__pages"><span>Pages</span><span>${book.pages}</span></li>
        <li class="card__list-item card__read-status">
          <label for="read-status">Read Status</label>
          <input class="checkbox" type="checkbox" id="read-status" ${book.readStatus ? "checked" : ""}/>
        </li>
      </ul>
    </article>`;
};

App.prototype._displayForm = function () {
  console.log(this);

  bookModal.showModal();
};

App.prototype._removeBook = function (e) {
  const btnRemove = e.target.closest(".btn--remove");
  if (!btnRemove) return;

  // get book id
  const bookId = this._parseBookIdFromBookEl(btnRemove);
  console.log(bookId);

  // remove book from lib
  const bookIdx = this._findBookIdxById(bookId);
  this.library.splice(bookIdx, 1);

  // Display book again
  this._displayBooks();

  // update local storage
  this._storeToLocalStorage("library", this.library);

  return this;
};

App.prototype._toggleReadStatus = function (e) {
  const readStatusEl = e.target.closest(".checkbox");
  if (!readStatusEl) return;

  const bookId = this._parseBookIdFromBookEl(readStatusEl);
  this._findBookIdxById(bookId).toggleReadStatus();
  console.log(this._findBookIdxById(bookId));

  // update local storage
  this._storeToLocalStorage("library", this.library);
};

App.prototype._parseBookIdFromBookEl = function (el) {
  return el.closest(".book").dataset.bookId;
};

App.prototype._findBookIdxById = function (id) {
  return this.library.find(book => book.bookId === id);
};

App.prototype._storeToLocalStorage = function (key, item) {
  localStorage.setItem(key, JSON.stringify(item));
};

App.prototype._fetchFromLocalStorage = function (key) {
  const item = localStorage.getItem(key);
  return JSON.parse(item);
};

// MAIN CODE
// DUMMY DATA
const book1 = new Book("The Lost Ocean", "Jane Doe", 245, false);
const book2 = new Book("Time and Space", "John Smith", 312, true);
const book3 = new Book("Shadows in the Dark", "Emily White", 180, false);
const book4 = new Book("The Last Recipe", "Alan Cook", 410, false);

const app = new App();
// Add books
// app._addNewBook(book1)._addNewBook(book2)._addNewBook(book3)._addNewBook(book4);
// render books (here for now, move to constructor function later when you store them in local storage as well!)
app._displayBooks();

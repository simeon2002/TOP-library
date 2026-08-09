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
    console.error("Input is not valid");
    return;
  }

  this.bookId = crypto.randomUUID();
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

App.prototype._displayBooks = function () {
  const html = this.library.map(this._getBookHtml);
  const formBody = document.querySelector(".table tbody");
  formBody.insertAdjacentHTML("afterbegin", html.join(""));
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

// MAIN CODE
// DUMMY DATA
const book1 = new Book("The Lost Ocean", "Jane Doe", 245, false);
const book2 = new Book("Time and Space", "John Smith", 312, true);
const book3 = new Book("Shadows in the Dark", "Emily White", 180, false);
const book4 = new Book("The Last Recipe", "Alan Cook", 410, false);

const app = new App();
app.addNewBook(book1).addNewBook(book2).addNewBook(book3).addNewBook(book4);
app._displayBooks();

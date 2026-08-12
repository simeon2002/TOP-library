"use strict";
const btnsAddNewBook = document.querySelectorAll(".btn--add");
const btnSubmitModal = document.querySelector(".btn--modal");
const btnCloseModal = document.querySelector(".btn--close-modal");
console.log(btnCloseModal);
const btnCardDisplay = document.querySelector(".btn--card");
const btnTableDisplay = document.querySelector(".btn--table");
const bookModal = document.querySelector("dialog");
const bookForm = document.querySelector("form");
const tableContainer = document.querySelector(".table tbody");
const cardsContainer = document.querySelector(".cards-container");
const displayContainer = document.querySelector(".display");
class Book {
    title;
    author;
    pages;
    readStatus;
    constructor(title, author, pages, readStatus, bookId){
        // TODO: add error handle for pages
        if (!(typeof title === "string") || title.length === 0 || !Number.isNaN(Number(title)) || !(typeof author === "string") || author.length === 0 || !Number.isNaN(Number(author))) {
            console.error("Input is not valid");
            console.log(typeof title, typeof author, Number.isFinite(pages));
            return;
        }
        this.bookId = bookId ?? crypto.randomUUID();
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.readStatus = readStatus;
    }
    toggleReadStatus() {
        this.readStatus = !this.readStatus;
    }
}
// APP CLASS
class App {
    constructor(defaultDisplayMode = "table"){
        // dummy data
        // this.library = [
        //   new Book("The Lost Ocean", "Jane Doe", 245, false),
        //   new Book("Time and Space", "John Smith", 312, true),
        //   new Book("Shadows in the Dark", "Emily White", 180, false),
        //   new Book("The Last Recipe", "Alan Cook", 410, false),
        // ];
        // Load library
        this.library = this.#loadLibrary();
        // render books view
        this.#renderBookView(defaultDisplayMode);
        // bind event listeners
        this.#bindEventListeners();
    }
    #loadLibrary() {
        return this.#fetchFromLocalStorage("library")?.map((book)=>new Book(book.title, book.author, book.pages, book.readStatus, book.bookId)) ?? [];
    }
    #bindEventListeners() {
        // Display form on add new button click
        btnsAddNewBook.forEach((btnAdd)=>btnAdd.addEventListener("click", this.#displayForm));
        // Submission of form
        bookForm.addEventListener("submit", this.#addNewBook.bind(this));
        // Remove book event listener
        displayContainer.addEventListener("click", this.#removeBook.bind(this));
        // Toggle read status
        displayContainer.addEventListener("click", this.#toggleReadStatus.bind(this));
        // swtich to card display mode
        btnCardDisplay.addEventListener("click", (e)=>this.#renderBookView("card"));
        // swtich to table display mode
        btnTableDisplay.addEventListener("click", (e)=>this.#renderBookView("table"));
        // close modal window
        btnCloseModal.addEventListener("click", (e)=>{
            e.preventDefault();
            bookModal.close();
        });
    }
    #renderBookView(displayFormat) {
        this.displayMode = displayFormat;
        // initialize display class settings
        this.#switchDisplayClasses(this.displayMode);
        // Display books on page load
        this.displayBooks(this.displayMode);
    }
    #switchDisplayClasses(displayFormat) {
        if (displayFormat === "table") {
            displayContainer.classList.remove("display--cards");
            displayContainer.classList.add("display--table");
            btnCardDisplay.classList.remove("btn--active");
            btnTableDisplay.classList.add("btn--active");
        }
        if (displayFormat === "card") {
            displayContainer.classList.add("display--cards");
            displayContainer.classList.remove("display--table");
            btnCardDisplay.classList.add("btn--active");
            btnTableDisplay.classList.remove("btn--active");
        }
    }
    displayBooks(displayFormat = "table") {
        let html;
        if (displayFormat === "table") {
            html = this.#isLibEmpty() === false ? this.library.map((book)=>this.#getBookHtml(book, displayFormat)).join("") : "No books found yet. Add Some!";
            tableContainer.innerHTML = "";
            tableContainer.insertAdjacentHTML("afterbegin", html);
        }
        if (displayFormat === "card") {
            const cardEls = cardsContainer.querySelectorAll(".card:not(.card--add-new)");
            cardEls.forEach((card)=>card.remove());
            html = this.library.map((book)=>this.#getBookHtml(book, displayFormat)).join("");
            cardsContainer.insertAdjacentHTML("afterbegin", html);
        }
    }
    #getBookHtml(book, displayFormat = "table") {
        if (displayFormat === "table") return `
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
        if (displayFormat === "card") return `
      <article class="book card" data-book-id=${book.bookId}>
        <!-- TODO: CAN BE ADDED TOGETHER WITH IMAGE UPLOAD SUPPORT <img src="" alt=""> -->
        <header class="card__header">
          <h2 class="card__book-title">
          ${book.title}
          </h2>
         <button class="btn--remove">
            <ion-icon name="close-outline"></ion-icon>
          </button>
        </header>
        <ul class="card__list card__book-details">
          <li class="card__list-item card__author"><span>Author</span> <span Cook>${book.author}</span></li>
          <li class="card__list-item card__pages"><span>Pages</span><span>${book.pages}</span></li>
          <li class="card__list-item card__read-status">
            <label for="read-status">Read Status</label>
            <input class="checkbox" type="checkbox" id="read-status" ${book.readStatus ? "checked" : ""}/>
          </li>
        </ul>
      </article>`;
    }
    #displayForm() {
        bookModal.showModal();
    }
    #parseBookIdFromBookEl(el) {
        return el.closest(".book").dataset.bookId;
    }
    #isLibEmpty = function(library) {
        return this.library.length === 0;
    };
    #addNewBook(e) {
        e.preventDefault();
        // fetch form data
        let [bookTitle, bookAuthor, bookPages, readStatus] = [
            ...new FormData(bookForm).values()
        ];
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
            this.displayBooks(this.displayMode);
            // reset bookForm
            bookForm.reset();
            // close book modal form
            bookModal.close();
            // store to local storage
            this.#storeToLocalStorage("library", this.library);
        } else alert("Please provide valid information in the input fields!");
        return this;
    }
    #removeBook(e) {
        const btnRemove = e.target.closest(".btn--remove");
        if (!btnRemove) return;
        // get book id
        const bookId = this.#parseBookIdFromBookEl(btnRemove);
        console.log(bookId);
        // remove book from lib
        const bookIdx = this.#findBookIdxById(bookId);
        this.library.splice(bookIdx, 1);
        // Display book again
        this.displayBooks(this.displayMode);
        // update local storage
        this.#storeToLocalStorage("library", this.library);
        return this;
    }
    #toggleReadStatus(e) {
        const readStatusEl = e.target.closest(".checkbox");
        console.log(readStatusEl);
        if (!readStatusEl) return;
        const bookId = this.#parseBookIdFromBookEl(readStatusEl);
        this.#findBookById(bookId).toggleReadStatus();
        // console.log(this._findBookIdxById(bookId));
        // update local storage
        this.#storeToLocalStorage("library", this.library);
    }
    #findBookIdxById(id) {
        return this.library.findIndex((book)=>book.bookId === id);
    }
    #findBookById(id) {
        return this.library.find((book)=>book.bookId === id);
    }
    #storeToLocalStorage = function(key, item) {
        localStorage.setItem(key, JSON.stringify(item));
    };
    #fetchFromLocalStorage = function(key) {
        const item = localStorage.getItem(key);
        return JSON.parse(item);
    };
}
// MAIN CODE
// DUMMY DATA
const book1 = new Book("The Lost Ocean", "Jane Doe", 245, false);
const book2 = new Book("Time and Space", "John Smith", 312, true);
const book3 = new Book("Shadows in the Dark", "Emily White", 180, false);
const book4 = new Book("The Last Recipe", "Alan Cook", 410, false);
const app = new App("card");
// Add books
// app._addNewBook(book1)._addNewBook(book2)._addNewBook(book3)._addNewBook(book4);
// render books (here for now, move to constructor function later when you store them in local storage as well!)
app.displayBooks();

//# sourceMappingURL=TOP-library.672d4772.js.map

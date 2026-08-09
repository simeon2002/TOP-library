"use strict";

const btnAddNewBook = document.querySelector(".btn--add");
const bookModal = document.querySelector("dialog");
const btnSubmitModal = document.querySelector(".btn--modal");

btnAddNewBook.addEventListener("click", e => {
  bookModal.showModal();
});

btnSubmitModal.addEventListener("click", e => {});

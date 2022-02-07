const bookListWrapper = document.getElementById('bookList');
const addBookForm = document.getElementById('addBookForm');

let books = [];

function removeBook(id) {
  books = books.filter((book) => book.id !== id);
}

function updateEventListeners(element = document) {
  const removeBookBtns = element.querySelectorAll('.removeBookBtn');

  removeBookBtns.forEach((removeBtn) => {
    removeBtn.addEventListener('click', (event) => {
      const { parentNode } = event.target;
      removeBook(parentNode.id);
      parentNode.remove();
    });
  });
}

function addBookToPage(data) {
  const { id, title, author } = data;

  bookListWrapper.innerHTML += `
  <li id="${id}">
    <h3>${title}</h3>
    <p>${author}</p>
    <button class="removeBookBtn">Remove</button>
  </li>
  `;

  // update event listener
  updateEventListeners(bookListWrapper);
}

books.forEach((book) => addBookToPage(book));

function addBookToCollection(data) {
  const { id, title, author } = data;
  books.push({
    id,
    title,
    author,
  });

  // add to the page
  addBookToPage(data);
}

addBookForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const id = Date.now().toString();
  const title = addBookForm.title.value.trim();
  const author = addBookForm.author.value.trim();

  addBookToCollection({
    id,
    title,
    author,
  });

  addBookForm.title.value = '';
  addBookForm.author.value = '';
});

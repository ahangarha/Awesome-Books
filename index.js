const bookListWrapper = document.getElementById('bookList');
const addBookForm = document.getElementById('addBookForm');

let books = [];

function isStorageAvailable(type) {
  let storage;
  try {
    storage = window[type];
    const x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return false;
  }
}

function updateStorage() {
  if (isStorageAvailable('localStorage')) {
    const storage = window.localStorage;
    storage.setItem(
      'books', JSON.stringify(books),
    );
  }
}

function removeBook(id) {
  books = books.filter((book) => book.id !== id);
  updateStorage();
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

function addBookToCollection(data) {
  const { id, title, author } = data;
  books.push({
    id,
    title,
    author,
  });

  updateStorage();

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

if (isStorageAvailable('localStorage')) {
  const localData = window.localStorage.getItem('books');
  if (localData) {
    books = JSON.parse(localData);
  }
}

books.forEach((book) => addBookToPage(book));

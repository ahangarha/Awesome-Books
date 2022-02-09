const bookListWrapper = document.getElementById('bookList');
const addBookForm = document.getElementById('addBookForm');

class BookCollection {
  constructor(bookContainer) {
    this.books = [];
    this.bookContainer = bookContainer;
    this.isStorageAvailable = false;
    this.checkStorageAvailable('localStorage');

    // get data from localStorage if exist!
    this.initialDataFetchFromLocalStorage();

    // add them to the page
    this.books.forEach((book) => this.addBookToPage(book));
  }

  initialDataFetchFromLocalStorage() {
    if (this.isStorageAvailable) {
      const localData = window.localStorage.getItem('books');
      if (localData) {
        this.books = JSON.parse(localData);
      }
    }
  }

  checkStorageAvailable(type) {
    let storage;
    try {
      storage = window[type];
      const x = '__storage_test__';
      storage.setItem(x, x);
      storage.removeItem(x);
      this.isStorageAvailable = true;
    } catch (e) {
      this.isStorageAvailable = false;
    }
  }

  addBookToPage(data) {
    const { id, title, author } = data;

    this.bookContainer.innerHTML += `
    <li id="${id}">
      <h3>${title}</h3>
      <p><em>By: ${author}</em></p>
      <button class="removeBookBtn">Remove</button>
    </li>
    `;

    // update event listener
    this.updateEventListeners(this.bookContainer);
  }

  addBookToCollection(data) {
    const { id, title, author } = data;

    this.books.push({
      id,
      title,
      author,
    });

    this.updateStorage();

    // add to the page
    this.addBookToPage(data);
  }

  updateEventListeners(element = document) {
    const removeBookBtns = element.querySelectorAll('.removeBookBtn');

    removeBookBtns.forEach((removeBtn) => {
      removeBtn.addEventListener('click', (event) => {
        const { parentNode } = event.target;
        this.removeBook(parentNode.id);
        parentNode.remove();
      });
    });
  }

  removeBook(id) {
    this.books = this.books.filter((book) => book.id !== id);
    this.updateStorage();
  }

  updateStorage() {
    if (this.isStorageAvailable) {
      const storage = window.localStorage;
      storage.setItem('books', JSON.stringify(this.books));
    }
  }
}

const bookCollection = new BookCollection(bookListWrapper);

addBookForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const id = Date.now().toString();
  const title = addBookForm.title.value.trim();
  const author = addBookForm.author.value.trim();

  bookCollection.addBookToCollection({
    id,
    title,
    author,
  });

  addBookForm.title.value = '';
  addBookForm.author.value = '';
});

const navigations = [
  {
    linkId: 'listMenuLink',
    targetId: 'listSection',
  },
  {
    linkId: 'addMenuLink',
    targetId: 'addSection',
  },
  {
    linkId: 'contactMenuLink',
    targetId: 'contactSection',
  },
];

navigations.forEach((navigation) => {
  const link = document.getElementById(navigation.linkId);

  link.addEventListener('click', (event) => {
    event.preventDefault();

    // hide all sections
    const allSections = document.querySelectorAll('main > section');
    allSections.forEach((section) => {
      section.classList.add('display-none');
    });

    // show the relevant section
    const target = document.getElementById(navigation.targetId);
    target.classList.remove('display-none');
  });
});

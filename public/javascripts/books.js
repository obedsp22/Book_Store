let addBook = (e) => {
    e.preventDefault();

    const form = document.querySelector('#bookform');

    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        form.reportValidity();
        return;
    }

    let chosenGenre = document.querySelector("#genre");
    let option = chosenGenre.options[chosenGenre.selectedIndex];
    let genre = option.value;

    if (genre == "") return;

    let formData = new FormData();
    formData.append('Cover', document.getElementById('file').files[0]);
    formData.append('Title', document.getElementById('title').value);
    formData.append('Author', document.getElementById('author').value);
    formData.append('Genre', genre);
    formData.append('isBorrowed', 'Available');

    fetch('/book', {
        method: "POST",
        body: formData,
    })
        .then(res => {
            if (res.ok) {
                alert("Book has been successfully added!");
                form.reset();
                form.classList.remove("was-validated");
                location.reload();
            }
        }).catch(err => console.log(err));
}

function editBook(book) {
    const modal = document.getElementById("modal");
    document.getElementById('utitle').value = book.Title;
    document.getElementById('uauthor').value = book.Author;
    document.getElementById('ugenre').value = book.Genre;
    document.getElementById('uid').value = book.BookId;

    modal.style.display = 'block';
}

function saveEditBook(e) {
    e.preventDefault();
    const form = document.querySelector('#editbookForm');

    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        form.reportValidity();
        return;
    }

    let chosenGenre = document.querySelector("#ugenre");
    let option = chosenGenre.options[chosenGenre.selectedIndex];
    let genre = option.value;

    if (genre == "") return;

    let formData = {
        Title: document.getElementById('utitle').value,
        Author: document.getElementById('uauthor').value,
        Genre: genre
    }

    let id = document.getElementById('uid').value;

    fetch(`/book/${id}`, {
        method: "PUT",
        body: JSON.stringify(formData),
        headers: {
            'Content-Type' : 'application/json'
        }
    })
        .then(res => {
            if (res.ok) {
                alert("Book has been successfully updated!");
                form.reset();
                form.classList.remove("was-validated");
                location.reload();
            }
        }).catch(err => console.log(err));
}

function closeM() {
    document.getElementById("modal").style.display = 'none';
}

function deleteBook(id) {
    if(!confirm('Are you sure you want to delete this book?')) {
        return;
    }

    fetch(`/book/${id}`, {
        method: 'DELETE'
    })
    .then(res => {
        if(res.ok) {
            alert('Book has been deleted!');
            location.reload();
        }
    })
}

function searchBook() {
    let bookSearch = document.getElementById('bookSearch').value;

    if(bookSearch == "") return;

    let filter = document.querySelector('input[name="filter"]:checked').value;

    fetch(`/book/search?${bookSearch}?${filter}`)
    .then(response => response.json())
    .then(data => printBooks(data))
    .catch(err => console.log(err));
}

let printBooks = (books) => {
    let div = '';

    books.forEach(book => {
        div +=`
        <div class="col-md-3">
            <div class="card text-center">
                <img src="/imagesdb/${book.Cover}" alt="Book Cover"  height="500">
                <div class="card-body">
                    <h5 class="card-title">${book.Title}</h5>
                    <p class="card-text">Author: ${book.Author}</p>
                    <p class="card-text">Genre: ${book.Genre}</p>
                    <div>
                        <a class="action" onclick='editBook(${JSON.stringify(book)})'>Edit</a>
                        <a class="action" onclick='deleteBook(${book.BookId})'>Remove</a>
                    </div>
                </div>
            </div>
        </div>`;
        console.log(book)
    });
    document.getElementById('mainpage').style.display = 'none';
    document.getElementById('filteredPage').innerHTML = div;
}
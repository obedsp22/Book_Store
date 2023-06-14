function showAbout() {
    document.getElementById('aboutModal').style.display = 'block';
}

function closeAbout() {
    document.getElementById('aboutModal').style.display = 'none';
}

function showLoan() {
    document.getElementById('rentModal').style.display = 'block';
}

function closeLoan() {
    document.getElementById('rentModal').style.display = 'none';
}

function closeModal() {
    document.getElementById('editRentModal').style.display = 'none';
}

let rentBook = (book) => {
    showLoan();
    document.getElementById('books').value = book.BookId;
}

window.onload = function () {
    getBooks();
    getReaders();
}

const getBooks = () => {
    fetch('/loan/getbooks')
        .then(response => response.json())
        .then(data => {
            printBook(data);
        });
}

function printBook(books) {
    let options = '';
    if (books.length == 0) options = '<option value="">No books found.</option>';
    books.forEach(b => {
        options += `
            <option value="${b.BookId}">${b.Title}</option>
        `;
    });
    document.getElementById('books').innerHTML = options;
}

const getReaders = () => {
    fetch('/loan/getreaders')
        .then(response => response.json())
        .then(data => {
            printReader(data);
        });
}

function printReader(readers) {
    let options = '';
    if (readers.length == 0) options = '<option value="">No readers found.</option>';
    readers.forEach(r => {
        options += `
            <option value="${r.ReadId}">${r.Name} ${r.LastName}</option>
        `;
    });
    document.getElementById('readers').innerHTML = options;
}
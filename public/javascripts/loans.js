let addLoan = (e) => {
    e.preventDefault();

    const form = document.querySelector('#rentForm');
    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        form.reportValidity();
        return;
    }

    let selectedReader = document.getElementById('readers');
    let option1 = selectedReader.options[selectedReader.selectedIndex];

    let selectedBook = document.getElementById('books');
    let option2 = selectedBook.options[selectedBook.selectedIndex];

    let options_ = [option1.value, option2.value];
    console.log(options_);

    let today = new Date();
    let returndt = document.getElementById('returnDT').value;
    if (returndt <= today) {
        alert(' Book must be returned on or before the due date.');
        return;
    }
    let formData = {
        LoanDate: document.getElementById('rentDT').value,
        ReturnDate: document.getElementById('returnDT').value,
        BookId: options_[1],
        ReaderId: options_[0]
    }

    fetch(`book/update/${formData.BookId}`, {
        method: "PUT",
    });

    fetch('/loan', {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(res => {
            if (res.ok) {
                alert('Loan has been successfully added!');
                form.reset();
                form.classList.remove('was-validated');
                location.reload();
            }
        }).catch(err => console.log(err));
}

let currentBook = 0;
function editLoan(loan) {
    const modal = document.getElementById('editRentModal');

    let rent = loan.LoanDate.substring(0, 10);
    let return_ = loan.ReturnDate.substring(0, 10);
    console.log(loan.BookId);

    document.getElementById('urentDT').value = rent;
    document.getElementById('ureturnDT').value = return_;
    document.getElementById('ureaders').value = loan.ReaderId;
    document.getElementById('ubooks').value = loan.BookId;
    document.getElementById('uid').value = loan.LoanId;

    currentBook = loan.BookId;

    modal.style.display = 'block';
}

function saveEditLoan(e) {
    e.preventDefault();

    const form = document.getElementById('editRent');
    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        form.reportValidity();
        return;
    }

    let selectedReader = document.getElementById('ureaders');
    let option1 = selectedReader.options[selectedReader.selectedIndex];

    let selectedBook = document.getElementById('ubooks');
    let option2 = selectedBook.options[selectedBook.selectedIndex];

    let options_ = [option1.value, option2.value];

    let formData = {
        LoanDate: document.getElementById('urentDT').value,
        ReturnDate: document.getElementById('ureturnDT').value,
        BookId: options_[1],
        ReaderId: options_[0]
    }

    let id = document.getElementById('uid').value;

    fetch(`book/makeavailable/${currentBook}`, { method: "PUT" });
    fetch(`book/update/${formData.BookId}`, { method: "PUT" });

    fetch(`/loan/${id}`, {
        method: "PUT",
        body: JSON.stringify(formData),
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(res => {
            if (res.ok) {
                alert('Loan has been successfully updated!');
                form.reset();
                form.classList.remove('was-validated');
                location.reload();
            }
        }).catch(err => console.log(err));
}

function deleteLoan(loan) {
    let id = loan.LoanId;
    let book = loan.BookId;

    if (!confirm('Are you sure you want to remove loan information?')) {
        return;
    }

    fetch(`/book/makeavailable/${book}`, { method: "PUT" });

    fetch(`/loan/${id}`, {
        method: "DELETE"
    })
        .then(res => {
            if (res.ok) {
                alert('Loan has been deleted!');
                location.reload();
            }
        })
}

function searchLoan() {
    let inp = document.getElementById('loaninp').value;

    if (inp == "") return;

    let filter = document.querySelector('input[name="filter"]:checked').value;

    fetch(`/loan/search?${inp}?${filter}`)
        .then(res => res.json())
        .then(data => printLoans(data))
        .catch(err => console.log(err));
}

function printLoans(data) {
    let tbl = '';

    data.forEach(loan => {
        tbl += `
        <tr>
            <td>${loan.LoanDate}</td>
            <td>${loan.ReturnDate}</td>
            <td>${loan.Title}</td>
            <td>${loan.Name} ${loan.LastName}</td>
            <td>
            <i class="bi bi-pencil-square" onclick="editReader(${JSON.stringify(loan)})"></i>
            <i class="bi bi-trash3" onclick="deleteReader(${loan.LoanId})"></i>
            </td>
        </tr>`;
    });

    document.getElementById('mainpage').style.display = 'none';
    document.getElementById('filteredpage').style.display = 'block';
    document.getElementById('loan_tbody').innerHTML = tbl;
}
let addReader = (e) => {
    e.preventDefault();

    const form = document.querySelector('#readerform');

    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        form.reportValidity();
        return;
    }

    let formData = {
        Name: document.getElementById('name').value,
        LastName: document.getElementById('lname').value,
        Address: document.getElementById('address').value,
        Phone: document.getElementById('phone').value,
    }

    fetch('/reader', {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
            'Content-Type' : 'application/json'
        }
    })
        .then(res => {
            if (res.ok) {
                alert("Reader has been successfully added!");
                form.reset();
                form.classList.remove("was-validated");
                location.reload();
            }
        }).catch(err => console.log(err));
}

function editReader(reader) {
    const modal = document.getElementById("modal");
    document.getElementById('uname').value = reader.Name;
    document.getElementById('ulname').value = reader.LastName;
    document.getElementById('uaddress').value = reader.Address;
    document.getElementById('uphone').value = reader.Phone;
    document.getElementById('uid').value = reader.ReadId;

    modal.style.display = 'block';
}

function saveEditReader(e) {
    e.preventDefault();
    const form = document.querySelector('#editreaderForm');

    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        form.reportValidity();
        return;
    }


    let formData = {
        Name: document.getElementById('uname').value,
        LastName: document.getElementById('ulname').value,
        Address: document.getElementById('uaddress').value,
        Phone: document.getElementById('uphone').value,
    }

    let id = document.getElementById('uid').value;

    fetch(`/reader/${id}`, {
        method: "PUT",
        body: JSON.stringify(formData),
        headers: {
            'Content-Type' : 'application/json'
        }
    })
        .then(res => {
            if (res.ok) {
                alert("Reader has been successfully updated!");
                form.reset();
                form.classList.remove("was-validated");
                location.reload();
            }
        }).catch(err => console.log(err));
}

function closeM() {
    document.getElementById("modal").style.display = 'none';
}

function deleteReader(id) {
    if(!confirm('Are you sure you want to delete this Reader?')) {
        return;
    }

    fetch(`/reader/${id}`, {
        method: 'DELETE'
    })
    .then(res => {
        if(res.ok) {
            alert('Reader has been deleted!');
            location.reload();
        }
    })
}

function searchReader() {
    let inp = document.getElementById('readerinp').value;

    if(inp == "") return;

    let filter = document.querySelector('input[name="filter"]:checked').value;

    fetch(`/reader/search?${inp}?${filter}`)
    .then(res => res.json())
    .then(data => printReaders(data))
    .catch(err => console.log(err));
}

function printReaders(data) {
    let tbl = '';

    data.forEach(reader => {
        tbl += `
        <tr>
            <td>${reader.ReadId}</td>
            <td>${reader.Name}</td>
            <td>${reader.LastName}</td>
            <td>${reader.Address}</td>
            <td>${reader.Phone}</td>
            <td>
            <i class="bi bi-pencil-square" onclick="editReader(${JSON.stringify(reader)})"></i>
            <i class="bi bi-trash3" onclick="deleteReader(${reader.ReadId})"></i>
            </td>
        </tr>`;
    });

    document.getElementById('mainpage').style.display = 'none';
    document.getElementById('filteredpage').style.display = 'block';
    document.getElementById('read_tbody').innerHTML = tbl;
}
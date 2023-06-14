const express = require('express');

var router = express.Router();

var conn = require('../dbconnection/connect');

router.get('/', function (req, res) {
    var cmd = `SELECT * FROM loans l 
    INNER JOIN books b ON b.BookId = l.BookId 
    INNER JOIN readers r ON r.ReadId = l.ReaderId`;
    conn.query(cmd, (error, result) => {
        if (error)
            console.log(error);
        else
            res.render('loans', { loans: result });
    });
});

router.post('/', function (req, res) {
    let form = req.body;
    var cmd = 'INSERT INTO loans SET ?';
    conn.query(cmd, form, (err, result) => {
        if (err)
            console.log(err);
        else
            res.end();
    });
});

router.put('/:id', (req, res) => {
    var id = req.params.id;
    var form = req.body;
    var cmd = 'UPDATE loans SET ? WHERE LoanId = ?';
    conn.query(cmd, [form, id], (err, result) => {
        if (err)
            console.log(err);
        else
            res.end();
    });
});

router.delete('/:id', (req, res) => {
    var id = req.params.id;
    var cmd = 'DELETE FROM loans WHERE LoanId = ?';
    conn.query(cmd, id, (err, result) => {
        if (err)
            console.log(err);
        else
            res.end();
    });
});

// Display loan form
router.get('/getreaders', (req, res) => {
    const cmd = 'SELECT * FROM readers';
    conn.query(cmd, (error, result) => {
        if (error)
            console.log(error);
        else {
            res.json(result);
        }
    });
});

router.get('/getbooks', (req, res) => {
    const cmd = "SELECT * FROM books WHERE isBorrowed = 'Available' ";
    conn.query(cmd, (err, result) => {
        if (err)
            console.log(err);
        else {
            res.json(result);
        }
    });
});

router.get('/editbooks', (req, res) => {
    const cmd = 'SELECT * FROM books';
    conn.query(cmd, (err, result) => {
        if (err)
            console.log(err);
        else {
            res.json(result);
        }
    });
});

router.get('/editreaders', (req, res) => {
    const cmd = 'SELECT * FROM readers';
    conn.query(cmd, (error, result) => {
        if (error)
            console.log(error);
        else {
            res.json(result);
        }
    });
});
// End

router.get(`/search`, function (req, res) {
    let inp = req.url.split('?')[1];
    let filter = req.url.split('?')[2];

    let strArr = inp.split('%20');
    let string = strArr.join(' ');

    var cmd = `SELECT * FROM loans l 
    INNER JOIN books b ON b.BookId = l.BookId 
    INNER JOIN readers r ON r.ReadId = l.ReaderId 
    WHERE ${filter} LIKE '%${string}%'`;
    conn.query(cmd, (err, result) => {
        if (err)
            console.log(err);
        else
            res.json(result);
    })
});

router.put('/update/:id', (req, res) => {
    var id = req.params.id;
    var cmd = "UPDATE books SET isBorrowed = 'isBorrowed' WHERE BookId = ?";
    conn.query(cmd, id, (err, result) => {
        if (err)
            console.log(err);
        else
            res.end();
    })
});

router.put('/available/:id', (req, res) => {
    var id = req.params.id;
    var cmd = "UPDATE books SET isBorrowed = 'Available' WHERE BookId = ?";
    conn.query(cmd, id, (err, result) => {
        if (err)
            console.log(err);
        else
            res.end();
    })
});

module.exports = router;
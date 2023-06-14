const express = require('express');
const formidable = require('formidable');
const fs = require('fs');
var router = express.Router();

var conn = require('../dbconnection/connect');

router.get('/', function (req, res) {
    var cmd = 'SELECT * FROM books';
    conn.query(cmd, (err, result) => {
        if (err)
            console.log(err);
        else
            res.render('book', { books: result });
    })
});

router.get('/new', function (req, res) {
    res.render('addbook');
});

router.post('/', function (req, res) {
    const form = formidable();
    form.parse(req, (err, fields, files) => {
        if (err) throw err;

        let oldpath = files.Cover.filepath;
        let imagesFolder = './public/imagesdb/';
        if (!fs.existsSync(imagesFolder)) {
            fs.mkdirSync(imagesFolder);
        }
        let newpath = imagesFolder + files.Cover.originalFilename;
        fs.copyFile(oldpath, newpath, function (err) {
            if (err) throw err;
        });

        let bookForm = {
            Cover: files.Cover.originalFilename,
            Title: fields.Title,
            Author: fields.Author,
            Genre: fields.Genre,
            isBorrowed: fields.isBorrowed
        }

        var cmd = 'INSERT INTO books SET ?';

        conn.query(cmd, bookForm, (error, result) => {
            if (error)
                console.log(error);
            else
                res.end();
        });
    });
});

router.put('/:id', (req, res) => {
    var id = req.params.id;
    var form = req.body;
    var cmd = 'UPDATE books SET ? WHERE BookId = ?';
    conn.query(cmd, [form, id], (err, result) => {
        if (err)
            console.log(err);
        else
            res.end();
    });
});

router.delete('/:id', (req, res) => {
    var id = req.params.id;
    var cmd = 'DELETE FROM books WHERE BookId = ?';
    conn.query(cmd, id, (err, result) => {
        if (err)
            console.log(err);
        else
            res.end();
    });
});

router.get(`/search`, function (req, res) {
    let inp = req.url.split('?')[1];
    let filter = req.url.split('?')[2];

    let strArr = inp.split('%20');
    let string = strArr.join(' ');

    var cmd = `SELECT * FROM books WHERE ${filter} LIKE '%${string}%'`;
    conn.query(cmd, (err, result) => {
        if (err)
            console.log(err);
        else
            res.json(result);
    })
});


router.put(`/update/:id`, (req, res) => {
    var id = req.params.id;
    var cmd = `UPDATE books SET isBorrowed = 'Borrowed' WHERE BookId = ?`;
    conn.query(cmd, id, (error, result) => {
        if(error)   
            console.log(error);
        else    
            res.end();
    });
});

router.put(`/makeavailable/:id`, (req, res) => {
    var id = req.params.id;
    var cmd = `UPDATE books set isBorrowed = 'Available' WHERE BookId = ?`;
    conn.query(cmd, id, (error, result) => {
        if(error)   
            console.log(error);
        else    
            res.end();
    });
});
module.exports = router;
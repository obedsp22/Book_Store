const express = require('express');

var router = express.Router();

var conn = require('../dbconnection/connect');

router.get('/', function (req, res) {
    var cmd = 'SELECT * FROM readers';
    conn.query(cmd, (err, result) => {
        if (err)
            console.log(err);
        else
            res.render('readers', { readers: result });
    })
});

router.get('/new', function (req, res) {
    res.render('addreader');
});

router.post('/', function (req, res) {
    let form = req.body;
    var cmd = 'INSERT INTO readers SET ?';
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
    var cmd = 'UPDATE readers SET ? WHERE ReadId = ?';
    conn.query(cmd, [form, id], (err, result) => {
        if (err)
            console.log(err);
        else
            res.end();
    });
});

router.delete('/:id', (req, res) => {
    var id = req.params.id;
    var cmd = 'DELETE FROM readers WHERE ReadId = ?';
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

    var cmd = `SELECT * FROM readers WHERE ${filter} LIKE '%${string}%'`;
    conn.query(cmd, (err, result) => {
        if (err)
            console.log(err);
        else
            res.json(result);
    })
});

module.exports = router;

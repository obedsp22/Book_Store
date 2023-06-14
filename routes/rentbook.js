const express = require('express');

var router = express.Router();

var conn = require('../dbconnection/connect');

router.get('/', function(req, res) {
    var cmd = 'SELECT * FROM books';
    conn.query(cmd, (err, results) => {
        if(err) console.log(err);
        else
            res.render('rentbook', { books: results });
    });
});

module.exports = router;
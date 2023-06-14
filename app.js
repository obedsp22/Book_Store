const express = require('express');
const path = require('path');
const port = 3000;

const indexRouter = require('./routes/index');
const bookRouter = require('./routes/book');
const readerRouter = require('./routes/reader');
const loanRouter = require('./routes/loan');
const rentabook = require('./routes/rentbook');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/book', bookRouter);
app.use('/reader', readerRouter);
app.use('/loan', loanRouter);
app.use('/rentabook', rentabook);

app.listen(port, () => console.log('Application running... Visit http://localhost:' + port));
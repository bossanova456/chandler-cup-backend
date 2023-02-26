const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const matchupsRouter = require('./routes/matchups');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/matchups', matchupsRouter);

const server = app.listen(3001, function () {
	const host = server.address().address
	const port = server.address().port
	
	console.log("Example app listening at http://%s:%s", host, port)
 });

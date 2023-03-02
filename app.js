const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const matchupsRouter = require('./routes/matchups');
const teamsRouter = require('./routes/teams');
const picksRouter = require('./routes/picks');
const usersRouter = require('./routes/users');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/matchups', matchupsRouter);
app.use('/teams', teamsRouter);
app.use('/picks', picksRouter);
app.use('/users', usersRouter);

const server = app.listen(3001, function () {
	// const host = server.address().address
	const port = server.address().port
	
	console.log("Listening on port %s", port)
 });

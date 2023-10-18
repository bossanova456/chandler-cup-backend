const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const matchupsRouter = require('./routes/matchups');
const teamsRouter = require('./routes/teams');
const picksRouter = require('./routes/picks');
const usersRouter = require('./routes/users');
const scoresRouter = require('./routes/scores')

const app = express();

const cors=require("cors");
const corsOptions = {
   origin:'*', 
   credentials:true,            // access-control-allow-credentials:true
   optionSuccessStatus:200,
}

app.use(cors(corsOptions)) // Use this after the variable declaration

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/matchups', matchupsRouter);
app.use('/teams', teamsRouter);
app.use('/picks', picksRouter);
app.use('/users', usersRouter);
app.use('/scores', scoresRouter);

const server = app.listen(3001, function () {
	// const host = server.address().address
	const port = server.address().port
	
	console.log("Listening on port %s", port)
 });

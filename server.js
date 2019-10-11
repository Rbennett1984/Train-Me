require('dotenv').config();
//serve index.html file
const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');

// add const for router
const {router: usersRouter} = require('./users');
const {router: authRouter, localStrategy, jwtStrategy} = require('./auth');
const {router: workoutRouter} = require('./workout');
const {router: journalRouter} = require('./journal');
// mongoose.Promise = global.Promise;

const {PORT, DATABASE_URL} = require('./config');

const app = express();

// 'public' - already directs to localhost 8080
app.use(express.static('public'));

// logging
app.use(morgan('common'));

// CORS
app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
	res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
	if (req.method === 'OPTIONS') {
		return res.send(204);
	}
	next();
});

// to use the local auth strategy, register here in server.js
app.use(passport.initialize());
// to use local auth strategy in a route, initialize Passport
// and register the strategy in server.js
passport.use(localStrategy);
// to register our JWT strategy with Passport, use the passport.use method:
passport.use(jwtStrategy);

app.use('/users/', usersRouter);
app.use('/auth/', authRouter);
app.use('/workout/', workoutRouter);
app.use('/journal/', journalRouter);

// use this to protect the /api/auth/login endpoint defined 
// in /auth/router.js

// use this to JWT strategy to protect endpoints:
// TEST ROUTE
app.get(
	'/protected',
	// use passport.authenticate middleware to protect the endpoint, 
	// passing JWT as the agument instead of the basic AUTH strategy:

	passport.authenticate('jwt', {session: false}),
	(req, res) => {
		return res.json({
			data: 'gardentime'
		});
	}
);

app.use('*', (req, res) => {
	return res.status(404).json({message: 'Not Found'});
});

let server;

function runServer() {
	return new Promise((resolve, reject) => {
		mongoose.connect(DATABASE_URL, {useMongoClient: true}, err => {
			if (err) {
				return reject(err);
			}
			server = app
				.listen(PORT, () => {
					console.log(`Your app is listening on port ${PORT}`);
					resolve();
				})
				.on('error', err => {
					mongoose.disconnect();
					reject(err);
				});
		});
	});
}

function closeServer() {
	return mongoose.disconnect().then(() => {
		return new Promise((resolve, reject) => {
			console.log('Closing server');
			server.close(err => {
				if (err) {
					return reject(err);
				}
				resolve();
			});
		});
	});
}

if (require.main === module) {
	runServer().catch(err => console.error(err));
}

module.exports = {app, runServer, closeServer};
const express = require('express');
const connectDB = require('./config/db');
const path = require('path');

const app = express();

// connect database
connectDB();

// init middleware (inc bodyParser which allows data to be retrieved in req.body eg in user.js)
app.use(express.json({ extended: false }));

// test / route - http://localhost:5000
// app.get('/', (req, res) => res.send('API running'));

// define routes
app.use('/api/users', require('./routes/api/users')); // http://localhost:5000/api/users
app.use('/api/auth', require('./routes/api/auth')); // http://localhost:5000/api/auth
app.use('/api/profile', require('./routes/api/profile')); // http://localhost:5000/api/profile
app.use('/api/posts', require('./routes/api/posts')); // http://localhost:5000/api/posts

// serve static assets in production
if (process.env.NOD_ENV === 'production') {
	// set static folder
	app.use(express.static('client/build'));

	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'clinet', 'build', 'index.html'));
	});
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

const express = require('express');
const connectDB = require('./config/db');

const app = express();

// connect database
connectDB();

app.get('/', (req, res) => res.send('API running'));

// define routes
app.use('/api/users', require('./routes/api/users')); // http://localhost:5000/api/users
app.use('/api/auth', require('./routes/api/auth')); // http://localhost:5000/api/auth
app.use('/api/profile', require('./routes/api/profile')); // http://localhost:5000/api/profile
app.use('/api/posts', require('./routes/api/posts')); // http://localhost:5000/api/posts

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

const express = require('express');
const dotenv = require('dotenv');
const loginRoutes = require('./routes/login/login.route');

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());

// Routes
app.use('/auth', loginRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

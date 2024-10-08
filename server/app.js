const express = require('express');
const dotenv = require('dotenv');
const loginRoutes = require('./routes/login/login.route');
const groupRoutes = require('./routes/groups/groups.route');
const formRoutes = require('./routes/forms/forms.route');
const responseRoutes = require('./routes/responses/responses.route');
const profileRoutes = require('./routes/profile/profile.route')

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());

// Routes
app.use('/api/auth', loginRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/forms', formRoutes);
app.use('/api/responses', responseRoutes);
app.use('/api/profile', profileRoutes)

// Start server
const PORT = process.env.BACKEND_PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

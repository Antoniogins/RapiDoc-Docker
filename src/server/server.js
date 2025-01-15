const express = require('express');
const cors = require('cors');
const specRoutes = require('./routes/specRoutes');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', specRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 
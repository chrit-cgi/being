const express = require('express');
const { Pool } = require('pg');
// const fetch = require('node-fetch'); // Required for Node < 18, built-in for Node 18+

const app = express();
app.use(express.json());

// Configure Postgres connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false // Set to false for internal Sliplane networking
});

/**
 * AUTH MIDDLEWARE (The Bouncer)
 * Validates the PocketBase token before allowing access to calculations.
 */
async function authenticateUser(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "No token provided. Please log in." });
  }

  try {
    // Verify token by calling the PocketBase internal API
    const authCheck = await fetch('http://127.0.0.1:8090/api/collections/users/auth-refresh', {
      method: 'POST',
      headers: { 'Authorization': token }
    });

    if (!authCheck.ok) throw new Error("Invalid session");

    const data = await authCheck.json();
    req.user = data.record; // Store user profile (ID, email) in the request object
    next(); // Proceed to the calculation route
  } catch (err) {
    res.status(401).json({ error: "Session expired or invalid." });
  }
}

/**
 * CALCULATION ROUTE
 * Perform complex analysis and store results in Postgres.
 */
app.post('/api/calculate', authenticateUser, async (req, res) => {
  const { valueA, valueB } = req.body;
  const userId = req.user.id;

  try {
    // Example logic: complex calculation or analysis
    const result = parseFloat(valueA) * parseFloat(valueB);

    // Save result to Postgres, linked to the unique PocketBase User ID
    await pool.query(
      'INSERT INTO user_calculations (user_id, input_data, result) VALUES ($1, $2, $3)',
      [userId, JSON.stringify(req.body), result]
    );

    res.json({ success: true, result });
  } catch (err) {
    console.error("DB Error:", err);
    res.status(500).json({ error: "Calculation failed in the database." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend Engine running on port ${PORT}`));
const express = require('express');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Database configuratie (gebruikt de Sliplane Environment Variable)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Nodig voor veel cloud-databases
  }
});

// 1. Serveer de statische bestanden uit de 'public' map (deze wordt door de Dockerfile gevuld)
app.use(express.static(path.join(__dirname, 'public')));

// 2. Een API endpoint om de database verbinding te testen
app.get('/api/status', async (req, res) => {
  try {
    const dbRes = await pool.query('SELECT NOW() as nu');
    res.json({ 
      status: 'success', 
      message: 'Backend is online!', 
      dbTime: dbRes.rows[0].nu 
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// 3. Zorg dat alle andere routes de frontend laden (belangrijk voor Single Page Apps)
// NIEUWE MANIER (Express 5)
// Gebruik een reguliere expressie direct, zonder aanhalingstekens
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server draait op poort ${port}`);
});
const express = require('express');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Database configuratie (gebruikt de Sliplane Environment Variable)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Alleen SSL gebruiken als we NIET met een .internal adres praten
  // ssl: process.env.DATABASE_URL.includes('.internal') ? false : { rejectUnauthorized: false }
  // but this does not work on sliplane, so:
  ssl: false
});

app.use(express.json()); // Nodig om formulier-data te kunnen lezen

// Route om alle documenten op te halen
// app.get('/api/documenten', async (req, res) => {
//  try {
//    const result = await pool.query('SELECT * FROM documenten ORDER BY datum_toegevoegd DESC');
//    res.json(result.rows);
//  } catch (err) {
//    res.status(500).json({ error: err.message });
//  }
// });

// Route om een nieuw document op te slaan
app.post('/api/documenten', async (req, res) => {
  const { titel, inhoud } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO documenten (titel, inhoud) VALUES ($1, $2) RETURNING *',
      [titel, inhoud]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 1. Serveer de statische bestanden uit de 'public' map (deze wordt door de Dockerfile gevuld)
// app.use(express.static(path.join(__dirname, 'public')));

// 2. Een API endpoint om de database verbinding te testen
// app.get('/api/status', async (req, res) => {
//  try {
//    console.log("Poging tot verbinden met DB...");
//    const dbRes = await pool.query('SELECT NOW() as nu');
//    console.log("DB verbinding succesvol!");
//    res.json({ 
//      status: 'success', 
//      dbTime: dbRes.rows[0].nu 
//    });
//  } catch (err) {
//    // We loggen de VOLLEDIGE fout in de Sliplane logs
//    console.error("DATABASE FOUT:", err); 
//    
//    // We sturen meer info terug naar de browser console
//    res.status(500).json({ 
//     status: 'error', 
//      message: err.message || "Onbekende fout",
//      stack: err.stack 
//    });
//  }
// });

// 3. Zorg dat alle andere routes de frontend laden (belangrijk voor Single Page Apps)
// NIEUWE MANIER (Express 5)
// Gebruik een reguliere expressie direct, zonder aanhalingstekens
// app.get(/.*/, (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// Tabel aanmaken als deze nog niet bestaat
pool.query(`
  CREATE TABLE IF NOT EXISTS documenten (
    id SERIAL PRIMARY KEY,
    titel VARCHAR(255) NOT NULL,
    inhoud TEXT,
    datum_toegevoegd TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`).then(() => console.log("Tabel 'documenten' is klaar voor gebruik!"))
  .catch(err => console.error("Fout bij aanmaken tabel:", err));

app.listen(port, () => {
  console.log(`Server draait op poort ${port}`);
});
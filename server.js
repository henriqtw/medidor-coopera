//
const { simular } = require('./calculos');

const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

const medicoes = [
  { id: 1, medidorId: "MED-001", leitura: 154.2, data: "2026-10-21T10:00:00Z" }
];

app.get('/', (req, res) => {
  res.send('API Medidor Coopera rodando com Nodemon!');
});


app.get('/medicoes', (req, res) => {
  res.json(medicoes);
});

app.post('/medicoes', (req, res) => {
  const { medidorId, leitura } = req.body || {};

  if (!medidorId || !leitura) {
    return res.status(400).json({ erro: 'Envie medidorId e leitura.' });
  }

  const novaMedicao = {
    id: medicoes.length + 1,
    medidorId,
    leitura,
    data: new Date().toISOString()
  };

  medicoes.push(novaMedicao);
  res.status(201).json(novaMedicao);
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
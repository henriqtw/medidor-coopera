const express = require('express');
const path = require('path');
const config = require('./config');
const { simular } = require('./calculos');

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/simular', (req, res) => {
  const { aparelhos } = req.body || {};

  if (!aparelhos || !Array.isArray(aparelhos) || aparelhos.length === 0) {
    return res.status(400).json({ erro: 'Envie ao menos um aparelho na lista.' });
  }

  const resultado = simular(aparelhos, 'BANDEIRA_AMARELA');

  return res.json(resultado);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(config.PORT, () => {
  console.log(`🚀 Medidor Coopera ativo em http://localhost:${config.PORT}`);
});
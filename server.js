// requisita o framework Express para criar o servidor e gerenciar as rotas HTTP
const express = require('express');
const config = require('./config');
const { simular } = require('./calculos');

// inicia o express
const app = express();

app.use(express.json());

app.use(express.static('public'));

app.post('/api/simular', (req, res) => {
  const { aparelhos } = req.body || {};

// verifica se o array 'aparelhos' não existe, se não é uma lista válida ou se está vazio

  if (!aparelhos || !Array.isArray(aparelhos) || aparelhos.length === 0) {
    return res.status(400).json({ erro: 'Envie ao menos um aparelho na lista.' });
  }

  const resultado = simular(aparelhos, 'BANDEIRA_AMARELA');

  return res.json(resultado);
});

app.listen(config.PORT, () => {
  console.log(`🚀 Medidor Coopera ativo em http://localhost:${config.PORT}`);
});
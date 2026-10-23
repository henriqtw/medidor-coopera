const express = require('express');
const { simular } = require('./calculos');

const app = express();
const PORT = 3000;

// Middlewares
app.use(express.json());
app.use(express.static('public'));

// Rota POST exigida pelo projeto
app.post('/api/simular', (req, res) => {
  const { aparelhos } = req.body || {};

  // Validação: verifica se a lista foi enviada
  if (!aparelhos || !Array.isArray(aparelhos) || aparelhos.length === 0) {
    return res.status(400).json({ erro: 'Envie ao menos um aparelho na lista.' });
  }

  // Executa o cálculo e retorna o resultado em JSON
  const resultado = simular(aparelhos);
  return res.json(resultado);
});

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`🚀 Medidor Coopera ativo em http://localhost:${PORT}`);
});
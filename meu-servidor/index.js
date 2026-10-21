const express = require('express');
const app = express();
const PORT = 3000;

// OBRIGATÓRIO para ler o corpo da requisição em JSON
app.use(express.json());

// Banco de dados em memória
const medicoes = [
  { id: 1, medidorId: "MED-001", leitura: 154.2, data: "2026-10-21T10:00:00Z" }
];

// Rota GET - Status
app.get('/', (req, res) => {
  res.send('API Medidor Coopera rodando!');
});

// Rota GET - Listar medições
app.get('/medicoes', (req, res) => {
  res.json(medicoes);
});

// Rota POST - Cadastrar medição
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
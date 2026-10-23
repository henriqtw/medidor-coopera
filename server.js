const express = require('express');

// MODIFICAÇÃO 1: Importação da função de simulação do módulo calculos.js
const { simular } = require('./calculos');

const app = express();
const PORT = 3000;

// Middleware para processar requisições com corpo em JSON
app.use(express.json());

// MODIFICAÇÃO 2: Adicionado middleware para servir os arquivos estáticos da pasta public (index.html, style.css, app.js)
app.use(express.static('public'));

// Rota de verificação simples
app.get('/', (req, res) => {
  res.send('API Medidor Coopera rodando!');
});

// MODIFICAÇÃO 3: Substituição das rotas de testes pela rota oficial exigida pelo projeto (POST /api/simular)
app.post('/api/simular', (req, res) => {
  const { aparelhos } = req.body || {};

  // Validação 1: Verificar se a lista de aparelhos foi enviada e não está vazia
  if (!aparelhos || !Array.isArray(aparelhos) || aparelhos.length === 0) {
    return res.status(400).json({ erro: 'Envie ao menos um aparelho na lista.' });
  }

  // Validação 2: Checar individualmente os atributos de cada aparelho conforme o contrato da API
  for (let i = 0; i < aparelhos.length; i++) {
    const item = aparelhos[i];
    const ident = `(aparelho ${i + 1})`;

    if (!item.nome || typeof item.nome !== 'string' || item.nome.trim() === '') {
      return res.status(400).json({ erro: `O nome do aparelho deve ser preenchido ${ident}.` });
    }
    if (typeof item.potenciaW !== 'number' || item.potenciaW < 1 || item.potenciaW > 10000) {
      return res.status(400).json({ erro: `potenciaW deve estar entre 1 e 10000 W ${ident}.` });
    }
    if (typeof item.horasDia !== 'number' || item.horasDia < 0 || item.horasDia > 24) {
      return res.status(400).json({ erro: `horasDia deve estar entre 0 e 24 ${ident}.` });
    }
    if (typeof item.diasMes !== 'number' || !Number.isInteger(item.diasMes) || item.diasMes < 1 || item.diasMes > 31) {
      return res.status(400).json({ erro: `diasMes deve ser um número inteiro entre 1 e 31 ${ident}.` });
    }
  }

  // Se os dados passarem na validação, executa as regras do calculos.js e envia a resposta 200 em JSON
  const resultado = simular(aparelhos);
  return res.json(resultado);
});

// Inicialização do servidor HTTP
app.listen(PORT, () => {
  console.log(`🚀 Medidor Coopera ativo em http://localhost:${PORT}`);
});
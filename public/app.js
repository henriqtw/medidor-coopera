// public/app.js

const statusServerText = document.querySelector('#status-server');
const statusDot = document.querySelector('#status-dot');

async function verificarStatusServidor() {
  try {
    // requisição de teste para o backend
    const resposta = await fetch('/api/simular', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ aparelhos: [] })
    });

    // Se o servidor respondeu (mesmo com status 400 por lista vazia), ele está ONLINE
    if (resposta.status === 400 || resposta.ok) {
      if (statusServerText) statusServerText.textContent = 'Servidor Online';
      if (statusDot) {
        statusDot.style.backgroundColor = '#2e7d32'; // Verde
        statusDot.style.boxShadow = '0 0 8px #2e7d32';
      }
    }
  } catch (erro) {
    // Se a requisição falhar (sem resposta de rede), o servidor está OFFLINE
    if (statusServerText) statusServerText.textContent = 'Servidor Offline';
    if (statusDot) {
      statusDot.style.backgroundColor = '#d32f2f'; 
      statusDot.style.boxShadow = '0 0 8px #d32f2f';
    }
  }
}

// Executa a checagem assim que a página é carregada
verificarStatusServidor();
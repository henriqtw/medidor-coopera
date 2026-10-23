// const para o status do servidor
const statusServerText = document.querySelector('#status-server');
const statusDot = document.querySelector('#status-dot');

async function verificarStatusServidor() {
  try {
    const resposta = await fetch('/api/simular', {
      method: 'POST',
      headers: {'Content-Type': 'aplication/json'},
      body: JSON.stringify({ aparelhos: [] })
    });

    }
}
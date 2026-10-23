// status do servidor

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

    // se o servidor respondeu (mesmo com status 400 por lista vazia), ele está ONLINE
    if (resposta.status === 400 || resposta.ok) {
      if (statusServerText) statusServerText.textContent = 'Servidor Online';
      if (statusDot) {
        statusDot.style.backgroundColor = '#2e7d32'; // Verde
        statusDot.style.boxShadow = '0 0 8px #2e7d32';
      }
    }
  } catch (erro) {
    // se a requisição falhar (sem resposta de rede), o servidor está OFFLINE
    if (statusServerText) statusServerText.textContent = 'Servidor Offline';
    if (statusDot) {
      statusDot.style.backgroundColor = '#d32f2f'; 
      statusDot.style.boxShadow = '0 0 8px #d32f2f';
    }
  }
}

// executa a checagem assim que a página é carregada
verificarStatusServidor();

//lista de aparelhos e contato com dom

let listaAparelhos = [];

const formAparelho = document.getElementById('form-aparelho');
const tabelaAparelhos = document.getElementById('tabela-aparelhos');
const btnSimular = document.getElementById('btn-simular');
const divResultado = document.getElementById('resultado');

//salvar aparelho local

formAparelho.addEventListener('submit', (event) => {
event.preventDefault();

const nome = document.getElementById('nome').value;
  const potenciaW = parseFloat(document.getElementById('potencia').value);
  const horasDia = parseFloat(document.getElementById('horas').value);
  const diasMes = parseFloat(document.getElementById('dias').value);

  // cria o objeto do aparelho e adiciona ao array
  const aparelho = { nome, potenciaW, horasDia, diasMes };
  listaAparelhos.push(aparelho);

  // limpa o formulário e atualiza a tabela no HTML
  formAparelho.reset();
  atualizarTabela();
});

function atualizarTabela(){
  tabelaAparelhos.innerHTML = '';

  listaAparelhos.forEach((item, index) => {
    const linha = document.createElement('tr');
    linha.innerHTML = `
      <td>${item.nome}</td>
      <td>${item.potenciaW} W</td>
      <td>${item.horasDia} h/dia</td>
      <td>${item.diasMes} dias</td>
      <td>
        <button onclick="removerAparelho(${index})">❌</button>
      </td>
    `;
    tabelaAparelhos.appendChild(linha);

  })
}

//remover aparelho
function removerAparelho (index){
  listaAparelhos.splice(index, 1);
  atualizarTabela();
}

//evento para adicionar a lista ao servidor e calcular

btnSimular.addEventListener('click', async () => {
  if (listaAparelhos.length === 0) {
    alert('Adicione pelo menos um aparelho antes de simular!');
    return;
  }

  try {
    const resposta = await fetch('/api/simular', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ aparelhos: listaAparelhos })
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      alert(dados.erro || 'Erro ao realizar simulação');
      return;
    }

    // renderiza o resultado recebido da API no HTML
    exibirResultado(dados);
  } catch (erro) {
    console.error('Erro na requisição:', erro);
    alert('Não foi possível conectar ao servidor.');
  }
});

// função para exibir os resultados processados
function exibirResultado(dados) {
  divResultado.innerHTML = `
    <h2>Resultado da Simulação</h2>
    <p><strong>Consumo Total:</strong> ${dados.consumoTotalKWh.toFixed(2)} kWh/mês</p>
    <p><strong>Custo Estimado (Bandeira Verde):</strong> R$ ${dados.custoBandeiraVerde.toFixed(2)}</p>
    <p><strong>Aparelho de Maior Consumo:</strong> ${dados.aparelhoMaiorConsumo ? dados.aparelhoMaiorConsumo.nome : 'N/A'}</p>
    <p><strong>Painéis Solares Necessários:</strong> ${dados.paineisEstimados} painel(éis)</p>
  `;
}
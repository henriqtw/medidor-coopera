// status do servidor

const statusServerText = document.querySelector('.status-server');
const statusDot = document.querySelector('.status-dot');

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
      if (statusServerText) statusServerText.textContent = 'Servidor Online (Node/Express)';
      if (statusDot) {
        statusDot.style.backgroundColor = '#2e7d32';
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
const tabelaAparelhos = document.getElementById('lista-aparelhos');
const btnSimular = document.getElementById('btn-simular');
const divResultado = document.getElementById('resultado');

//salvar aparelho local

formAparelho.addEventListener('submit', (event) => {
  event.preventDefault();

  const nome = document.getElementById('input-nome').value;
  const potenciaW = parseFloat(document.getElementById('input-potencia').value);
  const horasDia = parseFloat(document.getElementById('input-horas').value);
  const diasMes = parseFloat(document.getElementById('input-dias').value);

  // cria o objeto do aparelho e adiciona ao array
  const aparelho = { nome, potenciaW, horasDia, diasMes };
  listaAparelhos.push(aparelho);

  // limpa o formulário e atualiza a tabela no HTML
  formAparelho.reset();
  document.getElementById('input-dias').value = 30;
  atualizarTabela();
});

function atualizarTabela(){
  tabelaAparelhos.innerHTML = '';

  const estadoVazio = document.getElementById('estado-vazio');
  const contadorAparelhos = document.getElementById('contador-aparelhos');

  if (estadoVazio) {
    estadoVazio.style.display = listaAparelhos.length === 0 ? 'block' : 'none';
  }

  if (contadorAparelhos) {
    contadorAparelhos.innerText = `${listaAparelhos.length} itens`;
  }

  listaAparelhos.forEach((item, index) => {
    const linha = document.createElement('tr');
    linha.innerHTML = `
      <td>${item.nome}</td>
      <td>${item.potenciaW} W</td>
      <td>${item.horasDia} h/dia</td>
      <td>${item.diasMes} dias</td>
      <td style="text-align: right;">
        <button type="button" class="btn" style="padding: 0.2rem 0.5rem; background: #ef4444; color: white;" onclick="removerAparelho(${index})">❌</button>
      </td>
    `;
    tabelaAparelhos.appendChild(linha);
  });
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
  const placeholder = document.getElementById('placeholder-resultado');
  if (placeholder) placeholder.style.display = 'none';

  const resConsumo = document.getElementById('res-consumo');
  const resCusto = document.getElementById('res-custo');
  const resTotal = document.getElementById('res-total');
  const resPaineis = document.getElementById('res-paineis');
  const resMaisCaro = document.getElementById('res-mais-caro');

  if (resConsumo) resConsumo.innerText = `${dados.consumoTotalKWh.toFixed(2)} kWh`;
  if (resCusto) resCusto.innerText = `R$ ${dados.custoBandeiraVerde.toFixed(2)}`;
  if (resTotal) resTotal.innerText = `R$ ${dados.custoBandeiraVerde.toFixed(2)}`;
  if (resPaineis) resPaineis.innerText = `${dados.paineisEstimados} Painéis`;
  if (resMaisCaro) {
    resMaisCaro.innerText = dados.aparelhoMaiorConsumo ? `${dados.aparelhoMaiorConsumo.nome} (${dados.aparelhoMaiorConsumo.potenciaW}W)` : '-';
  }

  divResultado.style.display = 'block';
}
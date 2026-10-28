// Status do servidor
const statusServerText = document.querySelector('.status-server');
const statusDot = document.querySelector('.status-dot');

async function verificarStatusServidor() {
  try {
    const resposta = await fetch('/api/simular', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ aparelhos: [] })
    });

    if (resposta.status === 400 || resposta.ok) {
      if (statusServerText) statusServerText.textContent = 'Servidor Online (Node/Express)';
      if (statusDot) {
        statusDot.style.backgroundColor = '#2e7d32';
        statusDot.style.boxShadow = '0 0 8px #2e7d32';
      }
    }
  } catch (erro) {
    if (statusServerText) statusServerText.textContent = 'Servidor Offline';
    if (statusDot) {
      statusDot.style.backgroundColor = '#d32f2f'; 
      statusDot.style.boxShadow = '0 0 8px #d32f2f';
    }
  }
}

verificarStatusServidor();

// Lista de aparelhos e manipulação do DOM
let listaAparelhos = [];

const formAparelho = document.getElementById('form-aparelho');
const tabelaAparelhos = document.getElementById('lista-aparelhos');
const btnSimular = document.getElementById('btn-simular');
const divResultado = document.getElementById('resultado');

formAparelho.addEventListener('submit', (event) => {
  event.preventDefault();

  const nome = document.getElementById('input-nome').value;
  const potenciaW = parseFloat(document.getElementById('input-potencia').value) || 0;
  const horasDia = parseFloat(document.getElementById('input-horas').value) || 0;
  const diasMes = parseFloat(document.getElementById('input-dias').value) || 0;

  const aparelho = { nome, potenciaW, horasDia, diasMes };
  listaAparelhos.push(aparelho);

  formAparelho.reset();
  document.getElementById('input-dias').value = 30;
  atualizarTabela();
});

function atualizarTabela() {
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

function removerAparelho(index) {
  listaAparelhos.splice(index, 1);
  atualizarTabela();
}

btnSimular.addEventListener('click', async () => {
  if (listaAparelhos.length === 0) {
    alert('Adicione pelo menos um aparelho antes de simular!');
    return;
  }

  try {
    const resposta = await fetch('/api/simular', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ aparelhos: listaAparelhos })
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      alert(dados.erro || 'Erro ao realizar simulação');
      return;
    }

    exibirResultado(dados);
  } catch (erro) {
    console.error('Erro na requisição:', erro);
    alert('Não foi possível conectar ao servidor.');
  }
});

// Função para exibir os resultados processados sem quebras de referência
function exibirResultado(dados) {
  const placeholder = document.getElementById('placeholder-resultado');
  if (placeholder) placeholder.style.display = 'none';

  const resConsumo = document.getElementById('res-consumo');
  const resCusto = document.getElementById('res-custo');
  const resBandeira = document.getElementById('res-bandeira'); // Mapeado corretamente!
  const resTotal = document.getElementById('res-total');
  const resPaineis = document.getElementById('res-paineis');
  const resMaisCaro = document.getElementById('res-mais-caro');

  const consumo = (dados && Number(dados.consumoTotalKWh)) || 0;
  const custoBase = (dados && Number(dados.custoBandeiraVerde)) || 0;
  const custoAdicional = (dados && Number(dados.custoAdicionalBandeira)) || 0;
  const custoTotal = (dados && Number(dados.custoTotal)) || 0;
  const paineis = (dados && Number(dados.paineisEstimados)) || 0;

  if (resConsumo) resConsumo.innerText = `${consumo.toFixed(2)} kWh`;
  if (resCusto) resCusto.innerText = `R$ ${custoBase.toFixed(2)}`;
  if (resBandeira) resBandeira.innerText = `R$ ${custoAdicional.toFixed(2)}`;
  if (resTotal) resTotal.innerText = `R$ ${custoTotal.toFixed(2)}`;
  if (resPaineis) resPaineis.innerText = `${paineis} Painéis`;

  if (resMaisCaro) {
    resMaisCaro.innerText = (dados && dados.aparelhoMaiorConsumo) 
      ? `${dados.aparelhoMaiorConsumo.nome} (${dados.aparelhoMaiorConsumo.potenciaW}W)` 
      : '-';
  }

  if (divResultado) divResultado.style.display = 'block';
}
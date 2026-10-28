const config = require('./config');

// calculo do consumo mensal individual de um aparelho em kWh
function consumoMensalKwh(aparelho) {
  const potencia = Number(aparelho.potenciaW) || 0;
  const horas = Number(aparelho.horasDia) || 0;
  const dias = Number(aparelho.diasMes) || 0;

  return (potencia * horas * dias) / 1000;
}

// calculo do custo de energia com base na tarifa base e bandeira
function custoEnergia(consumoKWh, bandeira = 'BANDEIRA_AMARELA') {
  const tarifaBase = config.TARIFAS.TE_TUDS_BASE || 0.82;
  const adicionalBandeira = config.TARIFAS[bandeira] || 0.01885;

  const tarifaFinal = tarifaBase + adicionalBandeira;

  return consumoKWh * tarifaFinal;
}

// calculo do número de painéis solares necessários
function paineisNecessarios(consumoTotalKWh) {
  if (!consumoTotalKWh || consumoTotalKWh <= 0) return 0;

  const potenciaPainel = config.PAINEL_SOLAR.POTENCIA_PAINEL_W || 450;
  const hsp = config.PAINEL_SOLAR.HORAS_SOL_DIARIO || 4.5;
  const eficiencia = config.PAINEL_SOLAR.EFICIENCIA || 0.80;

  // geração mensal estimada de 1 painel (kWh/mês)
  const geracaoPorPainel = (potenciaPainel * hsp * 30 * eficiencia) / 1000;

  return Math.ceil(consumoTotalKWh / geracaoPorPainel);
}

// função principal de simulação
function simular(aparelhos, bandeira = 'BANDEIRA_AMARELA') {
  let consumoTotalKWh = 0;
  let aparelhoMaiorConsumo = null;
  let maiorConsumoItem = 0;

  const tarifaBase = config.TARIFAS.TE_TUDS_BASE || 0.82;
  const adicionalBandeira = config.TARIFAS[bandeira] || 0.01885;
  const tarifaFinal = tarifaBase + adicionalBandeira;

  const aparelhosDetalhados = [];

  if (Array.isArray(aparelhos)) {
    // calcula o consumo individual e o total acumulado
    aparelhos.forEach(aparelho => {
      const kwhAparelho = consumoMensalKwh(aparelho);
      consumoTotalKWh += kwhAparelho;

      if (kwhAparelho > maiorConsumoItem) {
        maiorConsumoItem = kwhAparelho;
        aparelhoMaiorConsumo = aparelho;
      }

      aparelhosDetalhados.push({
        nome: aparelho.nome,
        potenciaW: aparelho.potenciaW,
        kwhMes: kwhAparelho,
        custoEstimado: kwhAparelho * tarifaFinal,
        porcentagemTotal: 0
      });
    });

    // calcula o percentual individual sobre o total consumido
    aparelhosDetalhados.forEach(item => {
      item.porcentagemTotal = consumoTotalKWh > 0 
        ? (item.kwhMes / consumoTotalKWh) * 100 
        : 0;
    });
  }

  const custoBase = consumoTotalKWh * tarifaBase;
  const custoAdicionalBandeira = consumoTotalKWh * adicionalBandeira;
  const totalConta = custoBase + custoAdicionalBandeira;

  const totalPaineis = paineisNecessarios(consumoTotalKWh);

  return {
    consumoTotalKWh: consumoTotalKWh || 0,
    custoBandeiraVerde: custoBase || 0,
    custoAdicionalBandeira: custoAdicionalBandeira || 0,
    custoTotal: totalConta || 0,
    aparelhoMaiorConsumo,
    paineisEstimados: totalPaineis || 0,
    detalhamento: aparelhosDetalhados
  };
}

module.exports = {
  consumoMensalKwh,
  custoEnergia,
  paineisNecessarios,
  simular
};
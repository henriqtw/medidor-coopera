const config = require('./config');

// Calculo do consumo mensal individual de um aparelho em kWh
function consumoMensalKwh(aparelho) {
  const potencia = Number(aparelho.potenciaW) || 0;
  const horas = Number(aparelho.horasDia) || 0;
  const dias = Number(aparelho.diasMes) || 0;

  return (potencia * horas * dias) / 1000;
}

// Calculo do custo de energia com base na tarifa base e bandeira
function custoEnergia(consumoKWh, bandeira = 'BANDEIRA_AMARELA') {
  const tarifaBase = config.TARIFAS.TE_TUDS_BASE || 0.82;
  const adicionalBandeira = config.TARIFAS[bandeira] || 0.01885;

  const tarifaFinal = tarifaBase + adicionalBandeira;

  return consumoKWh * tarifaFinal;
}

// Calculo do número de painéis solares necessários
function paineisNecessarios(consumoTotalKWh) {
  if (!consumoTotalKWh || consumoTotalKWh <= 0) return 0;

  const potenciaPainel = config.PAINEL_SOLAR.POTENCIA_PAINEL_W || 450;
  const hsp = config.PAINEL_SOLAR.HORAS_SOL_DIARIO || 4.5;
  const eficiencia = config.PAINEL_SOLAR.EFICIENCIA || 0.80;

  // Geração mensal estimada de 1 painel (kWh/mês)
  const geracaoPorPainel = (potenciaPainel * hsp * 30 * eficiencia) / 1000;

  return Math.ceil(consumoTotalKWh / geracaoPorPainel);
}

// Função principal de simulação
function simular(aparelhos, bandeira = 'BANDEIRA_AMARELA') {
  let consumoTotalKWh = 0;
  let aparelhoMaiorConsumo = null;
  let maiorConsumoItem = 0;

  if (Array.isArray(aparelhos)) {
    aparelhos.forEach(aparelho => {
      const kwhAparelho = consumoMensalKwh(aparelho);
      consumoTotalKWh += kwhAparelho;

      if (kwhAparelho > maiorConsumoItem) {
        maiorConsumoItem = kwhAparelho;
        aparelhoMaiorConsumo = aparelho;
      }
    });
  }

  const tarifaBase = config.TARIFAS.TE_TUDS_BASE || 0.82;
  const adicionalBandeira = config.TARIFAS[bandeira] || 0.01885;

  const custoBase = consumoTotalKWh * tarifaBase;
  const custoAdicionalBandeira = consumoTotalKWh * adicionalBandeira;
  const totalConta = custoBase + custoAdicionalBandeira;

  const totalPaineis = paineisNecessarios(consumoTotalKWh);

  return {
    consumoTotalKWh: consumoTotalKWh || 0,
    custoBandeiraVerde: custoBase || 0,           // Custo base de energia
    custoAdicionalBandeira: custoAdicionalBandeira || 0, // Adicional da bandeira
    custoTotal: totalConta || 0,                   // Total final da conta
    aparelhoMaiorConsumo,
    paineisEstimados: totalPaineis || 0
  };
}

module.exports = {
  consumoMensalKwh,
  custoEnergia,
  paineisNecessarios,
  simular
};
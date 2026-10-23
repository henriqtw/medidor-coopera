// calculos.js
const cfg = require('./config');

function consumoMensalKwh(aparelho) { 
    return (aparelho.potenciaw * aparelho.horasdia * aparelho.diasMes) / 1000;
 }

function custoEnergia(kwh) { 
    return kwh * cfg.TARIFAS.BANDEIRA_VERDE;
 }

function adicionalBandeira(kwh) { 
    const adicionalPorKwh = cfg.TARIFAS.BANDEIRA_AMARELA - cfg.TARIFAS.BANDEIRA_VERDE;
  return kwh * adicionalPorKwh;
 }
function paineisNecessarios(kwh) { 
    if (kwh <= 0 ) return 0;

    // geração diária por painel (kWh) = (Potência em W * Horas de Sol * Eficiência) / 1000
    const geracaoDiariaPainel = (cfg.PAINEL_SOLAR.POTENCIA_PAINEL_W * cfg.PAINEL_SOLAR.HORAS_SOL_DIARIO * cfg.PAINEL_SOLAR.EFICIENCIA) / 1000;

    const geracaoMensalPainel = geracaoDiariaPainel * 30;

    // arredonda para cima para garantir que a demanda seja atendida por inteiro
    return Math.ceil(kwh / geracaoMensalPainel);
 }

function simular(aparelhos) {
  let consumoTotalKWh = 0;
  let aparelhoMaiorConsumo = null;
  let maiorConsumoItem = 0;

  aparelhos.forEach(aparelho => {
    const kwhAparelho = consumoMensalKwh(aparelho);
    consumoTotalKWh += kwhAparelho;

    if (kwhAparelho > maiorConsumoItem) {
      maiorConsumoItem = kwhAparelho;
      aparelhoMaiorConsumo = aparelho;
    }
  });

  const custoBandeiraVerde = custoEnergia(consumoTotalKWh);
  const paineisEstimados = paineisNecessarios(consumoTotalKWh);

  return {
    consumoTotalKWh,
    custoBandeiraVerde,
    aparelhoMaiorConsumo,
    paineisEstimados
  };
}


module.exports = { consumoMensalKwh, custoEnergia, adicionalBandeira, paineisNecessarios, simular };
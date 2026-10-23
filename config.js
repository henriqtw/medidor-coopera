//contato com o servidor para estabelecer valores e facilitar mudanças no futuro

module.exports = {
  PORT: process.env.PORT || 3000,

  TARIFAS: {
    BANDEIRA_VERDE: 0.75,
    BANDEIRA_AMARELA: 0.82,
    BANDEIRA_VERMELHA_1: 0.90,
    BANDEIRA_VERMELHA_2: 1.00
  },

  PAINEL_SOLAR: {
    POTENCIA_PAINEL_W: 550, // potência padrão de um painel em Watts
    HORAS_SOL_DIARIO: 5,   // média de horas de sol pleno por dia
    EFICIENCIA: 0.80        // fator de eficiência (80% para perdas térmicas/inversor)
  }
};
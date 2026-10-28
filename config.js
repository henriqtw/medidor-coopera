//contato com o servidor para estabelecer valores e facilitar mudanças no futuro

module.exports = {
  PORT: process.env.PORT || 3000,

  TARIFAS: {
    TE_TUDS_BASE: 0.82,
    BANDEIRA_VERDE: 0.00,
    BANDEIRA_AMARELA: 0.01885,
    BANDEIRA_VERMELHA_1: 4.463/100,
    BANDEIRA_VERMELHA_2: 7.877/100
  },

  PAINEL_SOLAR: {
    POTENCIA_PAINEL_W: 450, // potência padrão de um painel em Watts
    HORAS_SOL_DIARIO: 4,   // média de horas de sol pleno por dia
    EFICIENCIA: 0.80        // fator de eficiência (80% para perdas térmicas/inversor)
  }
};
export default function EmBranco() {
  const investimentos = [
    {
      nome: "CDB / Renda Fixa",
      subtipo: "Renda fixa",
      instituicao: "Banco Itaú",
      valorAplicado: "R$ 80.000,00",
      valorAtual: "R$ 84.500,00",
      rentabilidade: "↑ 5,63%",
      ganho: "R$ 4.500,00",
      percentual: "32,3%",
      icone: "🛡️",
    },
    {
      nome: "Ações",
      subtipo: "Renda variável",
      instituicao: "XP Investimentos",
      valorAplicado: "R$ 70.000,00",
      valorAtual: "R$ 74.200,00",
      rentabilidade: "↑ 6,00%",
      ganho: "R$ 4.200,00",
      percentual: "28,2%",
      icone: "📈",
    },
    {
      nome: "Fundos Imobiliários",
      subtipo: "Renda variável",
      instituicao: "NuInvest",
      valorAplicado: "R$ 45.000,00",
      valorAtual: "R$ 47.600,00",
      rentabilidade: "↑ 5,78%",
      ganho: "R$ 2.600,00",
      percentual: "18,1%",
      icone: "🏢",
    },
    {
      nome: "Reserva de Emergência",
      subtipo: "Liquidez diária",
      instituicao: "Banco Inter",
      valorAplicado: "R$ 30.000,00",
      valorAtual: "R$ 30.800,00",
      rentabilidade: "↑ 2,67%",
      ganho: "R$ 800,00",
      percentual: "12,1%",
      icone: "🐷",
    },
    {
      nome: "Criptomoedas",
      subtipo: "Renda variável",
      instituicao: "Binance",
      valorAplicado: "R$ 15.000,00",
      valorAtual: "R$ 15.900,00",
      rentabilidade: "↑ 6,00%",
      ganho: "R$ 900,00",
      percentual: "6,0%",
      icone: "₿",
    },
    {
      nome: "Outros Investimentos",
      subtipo: "Outros",
      instituicao: "BTG Pactual",
      valorAplicado: "R$ 8.000,00",
      valorAtual: "R$ 8.000,00",
      rentabilidade: "0,00%",
      ganho: "R$ 0,00",
      percentual: "3,2%",
      icone: "•••",
    },
  ];

  const distribuicao = [
    { nome: "CDB / Renda Fixa", valor: "32,3%", cor: "#2563eb" },
    { nome: "Ações", valor: "28,2%", cor: "#16a34a" },
    { nome: "Fundos Imobiliários", valor: "18,1%", cor: "#f59e0b" },
    { nome: "Reserva de Emergência", valor: "12,1%", cor: "#7c3aed" },
    { nome: "Criptomoedas", valor: "6,0%", cor: "#eab308" },
    { nome: "Outros Investimentos", valor: "3,2%", cor: "#94a3b8" },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Investimentos</h1>
          <p style={styles.subtitle}>
            Acompanhe e gerencie todos os seus investimentos em um só lugar.
          </p>
        </div>

        <button style={styles.addButton}>+ Adicionar investimento</button>
      </div>

      <div style={styles.topCards}>
        <div style={styles.topCard}>
          <div style={styles.topCardIconGreen}>💰</div>
          <div>
            <div style={styles.topCardLabel}>Patrimônio total</div>
            <div style={styles.topCardValue}>R$ 248.000,00</div>
            <div style={styles.topCardInfoGreen}>↑ 12,6% vs mês anterior</div>
          </div>
        </div>

        <div style={styles.topCard}>
          <div style={styles.topCardIconBlue}>📊</div>
          <div>
            <div style={styles.topCardLabel}>Total investido</div>
            <div style={styles.topCardValue}>R$ 210.000,00</div>
            <div style={styles.topCardInfoGreen}>↑ 10,3% vs mês anterior</div>
          </div>
        </div>

        <div style={styles.topCard}>
          <div style={styles.topCardIconPurple}>📈</div>
          <div>
            <div style={styles.topCardLabel}>Rentabilidade no mês</div>
            <div style={styles.topCardValue}>R$ 5.280,00</div>
            <div style={styles.topCardInfoGreen}>↑ 2,2% no mês</div>
          </div>
        </div>

        <div style={styles.topCard}>
          <div style={styles.topCardIconOrange}>🎯</div>
          <div>
            <div style={styles.topCardLabel}>Rentabilidade total</div>
            <div style={styles.topCardValue}>R$ 38.000,00</div>
            <div style={styles.topCardInfoGreen}>↑ 22,2% do total investido</div>
          </div>
        </div>
      </div>

      <div style={styles.gridTwo}>
        <div style={styles.panel}>
          <div style={styles.panelTitle}>Distribuição do patrimônio</div>

          <div style={styles.distribuicaoArea}>
            <div style={styles.circleWrap}>
              <div style={styles.circleOuter}>
                <div style={styles.circleInner}>
                  <div style={styles.circleTextSmall}>Total</div>
                  <div style={styles.circleTextBig}>R$ 248.000,00</div>
                </div>
              </div>
            </div>

            <div style={styles.legend}>
              {distribuicao.map((item) => (
                <div key={item.nome} style={styles.legendItem}>
                  <div style={{ ...styles.legendDot, background: item.cor }} />
                  <div style={styles.legendName}>{item.nome}</div>
                  <div style={styles.legendValue}>{item.valor}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={styles.panel}>
          <div style={styles.panelHeaderRow}>
            <div style={styles.panelTitle}>Evolução do patrimônio</div>
            <div style={styles.selectFake}>Este ano ▾</div>
          </div>

          <div style={styles.chartArea}>
            <div style={styles.chartLabelTop}>R$ 248.000</div>
            <div style={styles.chartLineOne}></div>
            <div style={styles.chartLineTwo}></div>
            <div style={styles.chartLineThree}></div>

            <div style={styles.chartMonths}>
              <span>Jan</span>
              <span>Fev</span>
              <span>Mar</span>
              <span>Abr</span>
              <span>Mai</span>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.tablePanel}>
        <div style={styles.tableHeader}>
          <div style={styles.panelTitle}>Meus investimentos</div>

          <div style={styles.tableActions}>
            <div style={styles.selectFake}>Todos os tipos ▾</div>
            <div style={styles.selectFake}>Ordenar por: Tipo ▾</div>
          </div>
        </div>

        <div style={styles.table}>
          <div style={styles.tableRowHead}>
            <div>Tipo de investimento</div>
            <div>Instituição / Corretora</div>
            <div>Valor aplicado</div>
            <div>Valor atual</div>
            <div>Rentabilidade</div>
            <div>% da carteira</div>
            <div>Ações</div>
          </div>

          {investimentos.map((item) => (
            <div key={item.nome} style={styles.tableRow}>
              <div style={styles.tipoCell}>
                <div style={styles.tipoIcon}>{item.icone}</div>
                <div>
                  <div style={styles.tipoNome}>{item.nome}</div>
                  <div style={styles.tipoSub}>{item.subtipo}</div>
                </div>
              </div>

              <div style={styles.tableText}>{item.instituicao}</div>
              <div style={styles.tableText}>{item.valorAplicado}</div>
              <div style={styles.tableGreen}>{item.valorAtual}</div>

              <div>
                <div style={styles.tableGreen}>{item.rentabilidade}</div>
                <div style={styles.tableGreenSmall}>{item.ganho}</div>
              </div>

              <div style={styles.tableText}>{item.percentual}</div>

              <div style={styles.actionButtons}>
                <button style={styles.iconButton}>✏️</button>
                <button style={styles.iconButtonRed}>🗑️</button>
              </div>
            </div>
          ))}

          <div style={styles.tableRowTotal}>
            <div style={styles.totalLabel}>Total</div>
            <div></div>
            <div style={styles.tableText}>R$ 248.000,00</div>
            <div style={styles.tableGreen}>R$ 261.000,00</div>
            <div>
              <div style={styles.tableGreen}>↑ 5,24%</div>
              <div style={styles.tableGreenSmall}>R$ 13.000,00</div>
            </div>
            <div style={styles.tableText}>100%</div>
            <div></div>
          </div>
        </div>
      </div>

      <div style={styles.gridTwoBottom}>
        <div style={styles.panel}>
          <div style={styles.panelTitle}>Alocação ideal x Atual</div>

          <div style={styles.allocList}>
            {[
              ["Renda Fixa", "40%", "32,3%", "-7,7%"],
              ["Renda Variável", "40%", "34,2%", "-5,8%"],
              ["Fundos Imobiliários", "10%", "18,1%", "+8,1%"],
              ["Reserva de Emergência", "10%", "12,1%", "+2,1%"],
              ["Criptomoedas", "5%", "6,0%", "+1,0%"],
              ["Outros", "5%", "3,2%", "-1,8%"],
            ].map((linha) => (
              <div key={linha[0]} style={styles.allocRow}>
                <div style={styles.allocName}>{linha[0]}</div>
                <div style={styles.allocValue}>{linha[1]}</div>
                <div style={styles.allocValue}>{linha[2]}</div>
                <div style={linha[3].includes("-") ? styles.allocRed : styles.allocGreen}>
                  {linha[3]}
                </div>
              </div>
            ))}
          </div>

          <div style={styles.tipBox}>
            💡 Sua carteira está um pouco concentrada em Fundos Imobiliários.
            Considere aumentar sua alocação em Renda Fixa para mais segurança.
          </div>
        </div>

        <div style={styles.panel}>
          <div style={styles.panelTitle}>Indicadores de performance</div>

          <div style={styles.metricRow}>
            <span>Retorno médio mensal</span>
            <strong style={styles.metricGreen}>0,9%</strong>
          </div>
          <div style={styles.metricRow}>
            <span>Retorno médio anual</span>
            <strong style={styles.metricGreen}>11,3%</strong>
          </div>
          <div style={styles.metricRow}>
            <span>Melhor investimento</span>
            <strong>Ações</strong>
          </div>
          <div style={styles.metricRow}>
            <span>Pior investimento</span>
            <strong>Reserva de Emergência</strong>
          </div>
          <div style={styles.metricRow}>
            <span>Índice de Sharpe</span>
            <strong>1,25</strong>
          </div>
          <div style={styles.metricRow}>
            <span>Volatilidade da carteira</span>
            <strong style={styles.metricOrange}>Moderada</strong>
          </div>
        </div>
      </div>

      <div style={styles.recomendacoesPanel}>
        <div style={styles.panelTitle}>Recomendações para você</div>

        <div style={styles.recomendacoesGrid}>
          <div style={styles.recomendacaoCard}>
            <div style={styles.recIconGreen}>🛡️</div>
            <div style={styles.recTitle}>Aumente sua reserva</div>
            <div style={styles.recText}>Sua reserva cobre 3,2 meses de despesas.</div>
            <div style={styles.recLink}>Ver recomendação →</div>
          </div>

          <div style={styles.recomendacaoCard}>
            <div style={styles.recIconBlue}>🥧</div>
            <div style={styles.recTitle}>Diversifique mais</div>
            <div style={styles.recText}>Considere diversificar mais em Renda Fixa.</div>
            <div style={styles.recLink}>Ver recomendação →</div>
          </div>

          <div style={styles.recomendacaoCard}>
            <div style={styles.recIconPurple}>📈</div>
            <div style={styles.recTitle}>Aporte consistente</div>
            <div style={styles.recText}>Mantenha aportes mensais para acelerar resultados.</div>
            <div style={styles.recLink}>Ver recomendação →</div>
          </div>

          <div style={styles.recomendacaoCard}>
            <div style={styles.recIconOrange}>📚</div>
            <div style={styles.recTitle}>Estude mais</div>
            <div style={styles.recText}>Continue aprendendo sobre investimentos e finanças.</div>
            <div style={styles.recLink}>Ir para Educação →</div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#07152d",
    color: "#ffffff",
    padding: "32px",
    boxSizing: "border-box",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    marginBottom: "24px",
    flexWrap: "wrap",
  },

  title: {
    margin: 0,
    fontSize: "48px",
    fontWeight: "800",
    lineHeight: 1.05,
  },

  subtitle: {
    marginTop: "8px",
    marginBottom: 0,
    fontSize: "16px",
    color: "#a9bddf",
  },

  addButton: {
    border: "none",
    borderRadius: "14px",
    padding: "14px 22px",
    background: "linear-gradient(90deg, #7c3aed 0%, #9333ea 100%)",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
  },

  topCards: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: "16px",
    marginBottom: "20px",
  },

  topCard: {
    background: "#0b1d38",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "18px",
    padding: "18px",
    display: "flex",
    alignItems: "flex-start",
    gap: "14px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
  },

  topCardIconGreen: {
    width: "52px",
    height: "52px",
    borderRadius: "14px",
    background: "#16a34a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    flexShrink: 0,
  },

  topCardIconBlue: {
    width: "52px",
    height: "52px",
    borderRadius: "14px",
    background: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    flexShrink: 0,
  },

  topCardIconPurple: {
    width: "52px",
    height: "52px",
    borderRadius: "14px",
    background: "#7c3aed",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    flexShrink: 0,
  },

  topCardIconOrange: {
    width: "52px",
    height: "52px",
    borderRadius: "14px",
    background: "#f59e0b",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    flexShrink: 0,
  },

  topCardLabel: {
    fontSize: "15px",
    color: "#dce7ff",
    marginBottom: "8px",
  },

  topCardValue: {
    fontSize: "34px",
    fontWeight: "800",
    lineHeight: 1.1,
    marginBottom: "8px",
  },

  topCardInfoGreen: {
    fontSize: "14px",
    color: "#4ade80",
    fontWeight: "700",
  },

  gridTwo: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    marginBottom: "20px",
  },

  panel: {
    background: "#0b1d38",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "18px",
    padding: "22px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
  },

  panelTitle: {
    fontSize: "30px",
    fontWeight: "800",
    marginBottom: "18px",
  },

  panelHeaderRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    marginBottom: "18px",
    flexWrap: "wrap",
  },

  selectFake: {
    padding: "10px 14px",
    borderRadius: "12px",
    background: "#0f274a",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#dbeafe",
    fontSize: "14px",
  },

  distribuicaoArea: {
    display: "grid",
    gridTemplateColumns: "240px 1fr",
    gap: "24px",
    alignItems: "center",
  },

  circleWrap: {
    display: "flex",
    justifyContent: "center",
  },

  circleOuter: {
    width: "220px",
    height: "220px",
    borderRadius: "50%",
    background:
      "conic-gradient(#2563eb 0 32.3%, #16a34a 32.3% 60.5%, #f59e0b 60.5% 78.6%, #7c3aed 78.6% 90.7%, #eab308 90.7% 96.7%, #94a3b8 96.7% 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  circleInner: {
    width: "125px",
    height: "125px",
    borderRadius: "50%",
    background: "#0b1d38",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    textAlign: "center",
    padding: "10px",
  },

  circleTextSmall: {
    fontSize: "14px",
    color: "#9fb6db",
  },

  circleTextBig: {
    fontSize: "18px",
    fontWeight: "800",
    marginTop: "6px",
  },

  legend: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  legendItem: {
    display: "grid",
    gridTemplateColumns: "16px 1fr auto",
    alignItems: "center",
    gap: "10px",
    color: "#e5efff",
    fontSize: "15px",
  },

  legendDot: {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
  },

  legendName: {
    fontWeight: "600",
  },

  legendValue: {
    color: "#d0def7",
    fontWeight: "700",
  },

  chartArea: {
    height: "290px",
    borderRadius: "16px",
    background:
      "linear-gradient(180deg, rgba(21,54,104,0.35) 0%, rgba(8,24,48,0.65) 100%)",
    border: "1px solid rgba(255,255,255,0.06)",
    position: "relative",
    overflow: "hidden",
    padding: "18px",
  },

  chartLabelTop: {
    position: "absolute",
    right: "18px",
    top: "18px",
    background: "#16a34a",
    color: "#ffffff",
    padding: "6px 10px",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "700",
  },

  chartLineOne: {
    position: "absolute",
    left: "50px",
    right: "50px",
    top: "80px",
    height: "3px",
    background: "#38bdf8",
    transform: "rotate(8deg)",
    transformOrigin: "left center",
    boxShadow: "0 0 12px rgba(56,189,248,0.8)",
  },

  chartLineTwo: {
    position: "absolute",
    left: "50px",
    right: "50px",
    top: "140px",
    height: "3px",
    background: "#fb7185",
    transform: "rotate(-6deg)",
    transformOrigin: "left center",
    boxShadow: "0 0 12px rgba(251,113,133,0.8)",
  },

  chartLineThree: {
    position: "absolute",
    left: "50px",
    right: "50px",
    top: "195px",
    height: "3px",
    background: "#4ade80",
    transform: "rotate(-2deg)",
    transformOrigin: "left center",
    boxShadow: "0 0 12px rgba(74,222,128,0.8)",
  },

  chartMonths: {
    position: "absolute",
    left: "26px",
    right: "26px",
    bottom: "18px",
    display: "flex",
    justifyContent: "space-between",
    color: "#a9bddf",
    fontSize: "14px",
    fontWeight: "700",
  },

  tablePanel: {
    background: "#0b1d38",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "18px",
    padding: "22px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
    marginBottom: "20px",
    overflowX: "auto",
  },

  tableHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "14px",
    marginBottom: "18px",
    flexWrap: "wrap",
  },

  tableActions: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },

  table: {
    minWidth: "1000px",
  },

  tableRowHead: {
    display: "grid",
    gridTemplateColumns: "2fr 1.3fr 1.1fr 1.1fr 1.1fr 0.8fr 0.8fr",
    gap: "14px",
    padding: "14px 10px",
    color: "#96afd3",
    fontSize: "14px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    fontWeight: "700",
  },

  tableRow: {
    display: "grid",
    gridTemplateColumns: "2fr 1.3fr 1.1fr 1.1fr 1.1fr 0.8fr 0.8fr",
    gap: "14px",
    padding: "18px 10px",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    alignItems: "center",
  },

  tableRowTotal: {
    display: "grid",
    gridTemplateColumns: "2fr 1.3fr 1.1fr 1.1fr 1.1fr 0.8fr 0.8fr",
    gap: "14px",
    padding: "18px 10px",
    alignItems: "center",
  },

  tipoCell: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  tipoIcon: {
    width: "46px",
    height: "46px",
    borderRadius: "12px",
    background: "#12325f",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
    color: "#ffffff",
    flexShrink: 0,
  },

  tipoNome: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#ffffff",
  },

  tipoSub: {
    fontSize: "13px",
    color: "#9ab0d4",
    marginTop: "4px",
  },

  tableText: {
    fontSize: "15px",
    color: "#e5efff",
  },

  tableGreen: {
    fontSize: "15px",
    color: "#4ade80",
    fontWeight: "700",
  },

  tableGreenSmall: {
    fontSize: "13px",
    color: "#4ade80",
    marginTop: "4px",
  },

  actionButtons: {
    display: "flex",
    gap: "8px",
  },

  iconButton: {
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "#12325f",
    color: "#ffffff",
    cursor: "pointer",
  },

  iconButtonRed: {
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "#4a1622",
    color: "#ffffff",
    cursor: "pointer",
  },

  totalLabel: {
    fontSize: "16px",
    fontWeight: "800",
    color: "#ffffff",
  },

  gridTwoBottom: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    marginBottom: "20px",
  },

  allocList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginBottom: "18px",
  },

  allocRow: {
    display: "grid",
    gridTemplateColumns: "1.5fr 0.7fr 0.7fr 0.7fr",
    gap: "12px",
    alignItems: "center",
  },

  allocName: {
    color: "#e5efff",
    fontSize: "15px",
    fontWeight: "600",
  },

  allocValue: {
    color: "#d2dff5",
    fontSize: "15px",
    textAlign: "right",
  },

  allocGreen: {
    color: "#4ade80",
    fontSize: "15px",
    textAlign: "right",
    fontWeight: "700",
  },

  allocRed: {
    color: "#fb7185",
    fontSize: "15px",
    textAlign: "right",
    fontWeight: "700",
  },

  tipBox: {
    marginTop: "18px",
    padding: "16px",
    borderRadius: "14px",
    background: "rgba(124,58,237,0.15)",
    color: "#ddd6fe",
    border: "1px solid rgba(124,58,237,0.28)",
    lineHeight: 1.5,
    fontSize: "14px",
  },

  metricRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    padding: "14px 0",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    color: "#e5efff",
    fontSize: "15px",
  },

  metricGreen: {
    color: "#4ade80",
  },

  metricOrange: {
    color: "#f59e0b",
  },

  recomendacoesPanel: {
    background: "#0b1d38",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "18px",
    padding: "22px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
  },

  recomendacoesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: "16px",
  },

  recomendacaoCard: {
    background: "#0e2443",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "16px",
    padding: "18px",
  },

  recIconGreen: {
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    background: "#16a34a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    marginBottom: "14px",
  },

  recIconBlue: {
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    background: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    marginBottom: "14px",
  },

  recIconPurple: {
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    background: "#7c3aed",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    marginBottom: "14px",
  },

  recIconOrange: {
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    background: "#f59e0b",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    marginBottom: "14px",
  },

  recTitle: {
    fontSize: "17px",
    fontWeight: "700",
    marginBottom: "8px",
  },

  recText: {
    fontSize: "14px",
    color: "#abc1e5",
    lineHeight: 1.5,
    marginBottom: "12px",
  },

  recLink: {
    fontSize: "14px",
    color: "#60a5fa",
    fontWeight: "700",
  },
};

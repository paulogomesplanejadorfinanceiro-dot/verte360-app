export default function Investimentos() {
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

      <div style={styles.cards}>
        <div style={styles.card}>
          <div style={styles.cardIconGreen}>💰</div>
          <div>
            <div style={styles.cardLabel}>Patrimônio total</div>
            <div style={styles.cardValue}>R$ 0,00</div>
            <div style={styles.cardInfoGreen}>Atualizado automaticamente</div>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardIconBlue}>📊</div>
          <div>
            <div style={styles.cardLabel}>Total investido</div>
            <div style={styles.cardValue}>R$ 0,00</div>
            <div style={styles.cardInfoBlue}>Atualizado automaticamente</div>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardIconPurple}>📈</div>
          <div>
            <div style={styles.cardLabel}>Rentabilidade no mês</div>
            <div style={styles.cardValue}>R$ 0,00</div>
            <div style={styles.cardInfoPurple}>Atualizado automaticamente</div>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardIconOrange}>🏆</div>
          <div>
            <div style={styles.cardLabel}>Rentabilidade total</div>
            <div style={styles.cardValue}>R$ 0,00</div>
            <div style={styles.cardInfoOrange}>Atualizado automaticamente</div>
          </div>
        </div>
      </div>

      <div style={styles.gridTop}>
        <div style={styles.panel}>
          <div style={styles.panelTitle}>Distribuição do patrimônio</div>
          <div style={styles.placeholderCircleWrap}>
            <div style={styles.placeholderCircle}>
              <div style={styles.placeholderCircleCenter}>
                <div style={styles.placeholderCircleText}>Total</div>
                <div style={styles.placeholderCircleValue}>R$ 0,00</div>
              </div>
            </div>
          </div>
        </div>

        <div style={styles.panel}>
          <div style={styles.panelHeader}>
            <div style={styles.panelTitle}>Evolução do patrimônio</div>
            <div style={styles.selectFake}>Este ano ▾</div>
          </div>

          <div style={styles.chartPlaceholder}>
            <div style={styles.chartLine1}></div>
            <div style={styles.chartLine2}></div>
            <div style={styles.chartLine3}></div>
          </div>
        </div>
      </div>

      <div style={styles.tablePanel}>
        <div style={styles.panelHeader}>
          <div style={styles.panelTitle}>Meus investimentos</div>
          <div style={styles.tableFilters}>
            <div style={styles.filterFake}>Todos os tipos ▾</div>
            <div style={styles.filterFake}>Ordenar por: Tipo ▾</div>
          </div>
        </div>

        <div style={styles.tableHeader}>
          <div>Tipo de investimento</div>
          <div>Instituição / Corretora</div>
          <div>Valor aplicado</div>
          <div>Valor atual</div>
          <div>Rentabilidade</div>
          <div>% da carteira</div>
          <div>Ações</div>
        </div>

        <div style={styles.emptyRow}>
          Nenhum investimento cadastrado ainda.
        </div>
      </div>

      <div style={styles.gridBottom}>
        <div style={styles.panel}>
          <div style={styles.panelTitle}>Alocação ideal x Atual</div>

          <div style={styles.allocRow}>
            <span>Renda Fixa</span>
            <div style={styles.barTrack}>
              <div style={{ ...styles.barFill, width: "40%" }}></div>
            </div>
            <span>0%</span>
          </div>

          <div style={styles.allocRow}>
            <span>Renda Variável</span>
            <div style={styles.barTrack}>
              <div style={{ ...styles.barFill, width: "25%" }}></div>
            </div>
            <span>0%</span>
          </div>

          <div style={styles.allocRow}>
            <span>Fundos Imobiliários</span>
            <div style={styles.barTrack}>
              <div style={{ ...styles.barFill, width: "18%" }}></div>
            </div>
            <span>0%</span>
          </div>

          <div style={styles.allocRow}>
            <span>Reserva</span>
            <div style={styles.barTrack}>
              <div style={{ ...styles.barFill, width: "12%" }}></div>
            </div>
            <span>0%</span>
          </div>

          <div style={styles.allocRow}>
            <span>Cripto</span>
            <div style={styles.barTrack}>
              <div style={{ ...styles.barFill, width: "8%" }}></div>
            </div>
            <span>0%</span>
          </div>

          <div style={styles.tipBox}>
            Sua carteira ainda está vazia. Cadastre investimentos para ver sua
            distribuição.
          </div>
        </div>

        <div style={styles.panel}>
          <div style={styles.panelTitle}>Indicadores de performance</div>

          <div style={styles.infoRow}>
            <span>Retorno médio mensal</span>
            <strong>0,0%</strong>
          </div>

          <div style={styles.infoRow}>
            <span>Retorno médio anual</span>
            <strong>0,0%</strong>
          </div>

          <div style={styles.infoRow}>
            <span>Melhor investimento</span>
            <strong>-</strong>
          </div>

          <div style={styles.infoRow}>
            <span>Pior investimento</span>
            <strong>-</strong>
          </div>

          <div style={styles.infoRow}>
            <span>Índice de Sharpe</span>
            <strong>0,00</strong>
          </div>

          <div style={styles.infoRow}>
            <span>Volatilidade da carteira</span>
            <strong>Baixa</strong>
          </div>
        </div>
      </div>

      <div style={styles.recomendacoesPanel}>
        <div style={styles.panelTitle}>Recomendações para você</div>

        <div style={styles.recomendacoesGrid}>
          <div style={styles.recomendacaoCard}>
            <div style={styles.recomendacaoTitle}>Aumente sua reserva</div>
            <div style={styles.recomendacaoText}>
              Crie sua base de segurança antes de aumentar risco.
            </div>
          </div>

          <div style={styles.recomendacaoCard}>
            <div style={styles.recomendacaoTitle}>Diversifique mais</div>
            <div style={styles.recomendacaoText}>
              Distribua melhor entre categorias diferentes.
            </div>
          </div>

          <div style={styles.recomendacaoCard}>
            <div style={styles.recomendacaoTitle}>Aporte consistente</div>
            <div style={styles.recomendacaoText}>
              Manter aportes mensais melhora o crescimento no longo prazo.
            </div>
          </div>

          <div style={styles.recomendacaoCard}>
            <div style={styles.recomendacaoTitle}>Estude mais</div>
            <div style={styles.recomendacaoText}>
              Aprenda antes de investir em ativos mais voláteis.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    padding: "30px",
    color: "#ffffff",
    background: "#07152d",
    minHeight: "100vh",
    boxSizing: "border-box",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    marginBottom: "24px",
  },

  title: {
    margin: 0,
    fontSize: "42px",
    fontWeight: "800",
  },

  subtitle: {
    marginTop: "6px",
    color: "#9fb2d1",
    fontSize: "15px",
  },

  addButton: {
    background: "linear-gradient(90deg, #7c3aed 0%, #9333ea 100%)",
    border: "none",
    padding: "14px 18px",
    borderRadius: "12px",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "14px",
    whiteSpace: "nowrap",
  },

  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: "16px",
    marginBottom: "20px",
  },

  card: {
    background: "#0c1f3d",
    border: "1px solid rgba(255,255,255,0.06)",
    padding: "20px",
    borderRadius: "16px",
    display: "flex",
    alignItems: "flex-start",
    gap: "14px",
  },

  cardIconGreen: {
    width: "46px",
    height: "46px",
    borderRadius: "12px",
    background: "#16a34a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    flexShrink: 0,
  },

  cardIconBlue: {
    width: "46px",
    height: "46px",
    borderRadius: "12px",
    background: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    flexShrink: 0,
  },

  cardIconPurple: {
    width: "46px",
    height: "46px",
    borderRadius: "12px",
    background: "#7c3aed",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    flexShrink: 0,
  },

  cardIconOrange: {
    width: "46px",
    height: "46px",
    borderRadius: "12px",
    background: "#f59e0b",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    flexShrink: 0,
  },

  cardLabel: {
    fontSize: "14px",
    color: "#dce8ff",
    marginBottom: "8px",
  },

  cardValue: {
    margin: 0,
    fontSize: "32px",
    fontWeight: "800",
  },

  cardInfoGreen: {
    marginTop: "8px",
    fontSize: "13px",
    color: "#22c55e",
  },

  cardInfoBlue: {
    marginTop: "8px",
    fontSize: "13px",
    color: "#60a5fa",
  },

  cardInfoPurple: {
    marginTop: "8px",
    fontSize: "13px",
    color: "#c084fc",
  },

  cardInfoOrange: {
    marginTop: "8px",
    fontSize: "13px",
    color: "#fbbf24",
  },

  gridTop: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "18px",
    marginBottom: "20px",
  },

  gridBottom: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "18px",
    marginBottom: "20px",
  },

  panel: {
    background: "#0b1d38",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "16px",
    padding: "20px",
    minHeight: "260px",
  },

  panelHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    marginBottom: "16px",
  },

  panelTitle: {
    margin: 0,
    fontSize: "30px",
    fontWeight: "700",
  },

  selectFake: {
    padding: "10px 14px",
    borderRadius: "10px",
    background: "#10284d",
    color: "#dce8ff",
    fontSize: "14px",
    whiteSpace: "nowrap",
  },

  placeholderCircleWrap: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "210px",
  },

  placeholderCircle: {
    width: "220px",
    height: "220px",
    borderRadius: "50%",
    background:
      "conic-gradient(#2563eb 0% 30%, #16a34a 30% 55%, #7c3aed 55% 72%, #f59e0b 72% 88%, #64748b 88% 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  placeholderCircleCenter: {
    width: "110px",
    height: "110px",
    borderRadius: "50%",
    background: "#0b1d38",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },

  placeholderCircleText: {
    fontSize: "13px",
    color: "#9fb2d1",
  },

  placeholderCircleValue: {
    fontSize: "18px",
    fontWeight: "700",
  },

  chartPlaceholder: {
    marginTop: "20px",
    height: "220px",
    borderRadius: "16px",
    background: "linear-gradient(180deg, #0f274b 0%, #0a1f3d 100%)",
    position: "relative",
    overflow: "hidden",
  },

  chartLine1: {
    position: "absolute",
    left: "20px",
    right: "20px",
    top: "65%",
    height: "3px",
    background: "#22c55e",
    transform: "rotate(-7deg)",
    borderRadius: "999px",
  },

  chartLine2: {
    position: "absolute",
    left: "20px",
    right: "20px",
    top: "48%",
    height: "3px",
    background: "#fb7185",
    transform: "rotate(6deg)",
    borderRadius: "999px",
  },

  chartLine3: {
    position: "absolute",
    left: "20px",
    right: "20px",
    top: "35%",
    height: "3px",
    background: "#60a5fa",
    transform: "rotate(-6deg)",
    borderRadius: "999px",
  },

  tablePanel: {
    background: "#0b1d38",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "16px",
    padding: "20px",
    marginBottom: "20px",
  },

  tableFilters: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },

  filterFake: {
    padding: "10px 14px",
    borderRadius: "10px",
    background: "#10284d",
    color: "#dce8ff",
    fontSize: "14px",
    whiteSpace: "nowrap",
  },

  tableHeader: {
    display: "grid",
    gridTemplateColumns: "2fr 1.6fr 1.2fr 1.2fr 1.2fr 1fr 0.8fr",
    gap: "12px",
    color: "#8ea7cf",
    fontSize: "13px",
    padding: "16px 0",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    marginTop: "8px",
  },

  emptyRow: {
    padding: "20px 0 6px",
    color: "#9fb2d1",
    fontSize: "15px",
  },

  allocRow: {
    display: "grid",
    gridTemplateColumns: "140px 1fr 50px",
    alignItems: "center",
    gap: "10px",
    marginBottom: "14px",
    color: "#dce8ff",
    fontSize: "14px",
  },

  barTrack: {
    width: "100%",
    height: "10px",
    background: "#11294c",
    borderRadius: "999px",
    overflow: "hidden",
  },

  barFill: {
    height: "100%",
    background: "linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)",
    borderRadius: "999px",
  },

  tipBox: {
    marginTop: "20px",
    background: "rgba(124, 58, 237, 0.15)",
    border: "1px solid rgba(192, 132, 252, 0.2)",
    borderRadius: "12px",
    padding: "14px",
    color: "#d8c7ff",
    fontSize: "14px",
  },

  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 0",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    color: "#dce8ff",
    fontSize: "15px",
  },

  recomendacoesPanel: {
    background: "#0b1d38",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "16px",
    padding: "20px",
  },

  recomendacoesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: "14px",
    marginTop: "18px",
  },

  recomendacaoCard: {
    background: "#0f223f",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "14px",
    padding: "18px",
  },

  recomendacaoTitle: {
    fontSize: "16px",
    fontWeight: "700",
    marginBottom: "8px",
  },

  recomendacaoText: {
    fontSize: "14px",
    color: "#9fb2d1",
    lineHeight: 1.5,
  },
};

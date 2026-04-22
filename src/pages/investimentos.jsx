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

        <button style={styles.button}>+ Adicionar investimento</button>
      </div>

      <div style={styles.cards}>
        <div style={styles.card}>
          <span style={styles.cardLabel}>💰 Patrimônio total</span>
          <h2 style={styles.cardValue}>R$ 0,00</h2>
        </div>

        <div style={styles.card}>
          <span style={styles.cardLabel}>📊 Total investido</span>
          <h2 style={styles.cardValue}>R$ 0,00</h2>
        </div>

        <div style={styles.card}>
          <span style={styles.cardLabel}>📈 Rentabilidade no mês</span>
          <h2 style={styles.cardValue}>R$ 0,00</h2>
        </div>

        <div style={styles.card}>
          <span style={styles.cardLabel}>🏆 Rentabilidade total</span>
          <h2 style={styles.cardValue}>R$ 0,00</h2>
        </div>
      </div>

      <div style={styles.grid}>
        <div style={styles.panel}>
          <h3 style={styles.panelTitle}>Distribuição do patrimônio</h3>
        </div>

        <div style={styles.panel}>
          <h3 style={styles.panelTitle}>Evolução do patrimônio</h3>
        </div>
      </div>

      <div style={styles.tablePanel}>
        <h3 style={styles.panelTitle}>Meus investimentos</h3>
        <div style={styles.emptyText}>Nenhum investimento cadastrado ainda.</div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    padding: "30px",
    color: "#ffffff",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    marginBottom: "20px",
  },

  title: {
    margin: 0,
    fontSize: "42px",
    fontWeight: "800",
  },

  subtitle: {
    marginTop: "6px",
    color: "#9fb2d1",
    fontSize: "14px",
  },

  button: {
    background: "linear-gradient(90deg, #7c3aed 0%, #9333ea 100%)",
    border: "none",
    padding: "12px 18px",
    borderRadius: "12px",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "14px",
  },

  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: "15px",
    marginBottom: "20px",
  },

  card: {
    background: "#0f223f",
    border: "1px solid rgba(255,255,255,0.06)",
    padding: "20px",
    borderRadius: "16px",
  },

  cardLabel: {
    display: "block",
    color: "#d7e6ff",
    fontSize: "14px",
    marginBottom: "10px",
  },

  cardValue: {
    margin: 0,
    fontSize: "30px",
    fontWeight: "800",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "18px",
    marginBottom: "20px",
  },

  panel: {
    minHeight: "260px",
    background: "#0b1d38",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "16px",
    padding: "20px",
  },

  tablePanel: {
    minHeight: "220px",
    background: "#0b1d38",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "16px",
    padding: "20px",
  },

  panelTitle: {
    margin: 0,
    fontSize: "26px",
    fontWeight: "700",
    marginBottom: "16px",
  },

  emptyText: {
    color: "#9fb2d1",
    fontSize: "15px",
  },
};

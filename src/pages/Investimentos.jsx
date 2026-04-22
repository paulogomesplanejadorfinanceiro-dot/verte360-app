export default function Investimentos() {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.iconBox}>📊</div>

        <div>
          <h1 style={styles.title}>Investimentos</h1>
          <p style={styles.subtitle}>
            Área de investimentos do Vertex360.
          </p>
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.cardTitle}>Página carregada com sucesso</div>
        <div style={styles.cardText}>
          Agora essa aba está funcionando. Depois a gente adiciona os campos,
          tabela, gráfico e conexão com o banco.
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
    alignItems: "center",
    gap: "16px",
    marginBottom: "28px",
  },

  iconBox: {
    width: "64px",
    height: "64px",
    borderRadius: "16px",
    background: "linear-gradient(135deg, #2563eb 0%, #38bdf8 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    boxShadow: "0 10px 24px rgba(37, 99, 235, 0.35)",
    flexShrink: 0,
  },

  title: {
    margin: 0,
    fontSize: "44px",
    fontWeight: "800",
    lineHeight: 1.1,
  },

  subtitle: {
    marginTop: "6px",
    marginBottom: 0,
    fontSize: "16px",
    color: "#a9bddf",
  },

  card: {
    background: "#0b1d38",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "18px",
    padding: "24px",
    maxWidth: "720px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.20)",
  },

  cardTitle: {
    fontSize: "24px",
    fontWeight: "700",
    marginBottom: "10px",
  },

  cardText: {
    fontSize: "16px",
    lineHeight: 1.6,
    color: "#c7d7f2",
  },
};

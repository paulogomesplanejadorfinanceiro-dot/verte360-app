export default function EmBranco({ titulo }) {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>{titulo}</h1>

      <div style={styles.box}>
        <p style={styles.text}>
          Essa área ainda não foi desenvolvida.
        </p>
        <p style={styles.sub}>
          Em breve você poderá usar essa função aqui dentro do Vertex360.
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    padding: "40px",
    color: "#fff",
  },

  title: {
    fontSize: "36px",
    fontWeight: "800",
    marginBottom: "30px",
  },

  box: {
    background: "#0b1d38",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "16px",
    padding: "40px",
    textAlign: "center",
  },

  text: {
    fontSize: "18px",
    marginBottom: "10px",
  },

  sub: {
    fontSize: "14px",
    color: "#9fb2d1",
  },
};

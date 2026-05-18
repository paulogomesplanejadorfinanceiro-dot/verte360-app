export default function Sidebar({ setPage, currentPage }) {
  const menu = [
    { label: "Dashboard", page: "dashboard", icon: "🏠" },
    { label: "Lançamentos", page: "lancamentos", icon: "💰" },
    { label: "Metas", page: "metas", icon: "🎯" },
    { label: "Planejamento", page: "planejamento", icon: "📅" },
    { label: "Relatórios", page: "relatorios", icon: "📈" },
    { label: "Investimentos", page: "investimentos", icon: "📊" },
    { label: "Educação Financeira", page: "educacao", icon: "📚" }
  ];

  return (
    <div style={styles.sidebar}>
      <h2 style={styles.logo}>Vertex360</h2>

      {menu.map((item) => (
        <div
          key={item.page}
          onClick={() => setPage(item.page)}
          style={{
            ...styles.item,
            background:
              currentPage === item.page ? "#1e40af" : "transparent"
          }}
        >
          <span style={{ marginRight: 10 }}>{item.icon}</span>
          {item.label}
        </div>
      ))}
    </div>
  );
}

const styles = {
  sidebar: {
    width: 250,
    minHeight: "100vh", /* GARANTE QUE A BARRA VAI ATÉ O FINAL DA TELA NA VERTICAL */
    background: "#020617",
    color: "#fff",
    padding: 20,
    boxSizing: "border-box", /* EVITA QUE O PADDING EXTRA QUEBRE O TAMANHO FIADO */
    position: "sticky", /* FAZ A SIDEBAR FICAR FIXA ENQUANTO O USUÁRIO ROLA A PÁGINA */
    top: 0
  },
  logo: {
    marginBottom: 30,
    fontSize: "24px",
    fontWeight: "800",
    letterSpacing: "0.5px"
  },
  item: {
    padding: 12,
    borderRadius: 8,
    cursor: "pointer",
    marginBottom: 10,
    display: "flex",
    alignItems: "center",
    transition: "background 0.2s ease" /* DEIXA O CLIQUE MAIS SUAVE */
  }
};

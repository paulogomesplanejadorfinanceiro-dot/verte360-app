export default function Sidebar({ setPage, currentPage }) {
  const menu = [
    { label: "Dashboard", page: "dashboard" },
    { label: "Lançamentos", page: "lancamentos" },
    { label: "Relatórios", page: "relatorios" },
    { label: "Metas", page: "metas" },
    { label: "Investimentos", page: "investimentos" },
    { label: "Planejamento", page: "planejamento" },
    { label: "Educação", page: "educacao" },
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
              currentPage === item.page ? "#1e293b" : "transparent",
          }}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
}

const styles = {
  sidebar: {
    width: "220px",
    background: "#020617",
    color: "#fff",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  logo: {
    marginBottom: "20px",
    fontSize: "20px",
  },
  item: {
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "0.2s",
  },
};

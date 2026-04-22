export default function Sidebar({ setPage, currentPage }) {
  const menuItems = [
    { icon: "📊", label: "Dashboard", page: "dashboard" },
    { icon: "💰", label: "Lançamentos", page: "lancamentos" },
    { icon: "🎯", label: "Metas", page: "metas" },
    { icon: "📅", label: "Planejamento", page: "planejamento" },
    { icon: "📈", label: "Relatórios", page: "relatorios" },
    { icon: "📚", label: "Educação", page: "educacao" },
    { icon: "⚙️", label: "Configurações", page: "config" },
  ];

  return (
    <aside style={styles.sidebar}>
      <div>
        <div style={styles.brandBlock}>
          <div style={styles.logoBox}>
            <span style={styles.logoV}>V</span>
          </div>

          <div>
            <div style={styles.logoText}>Vertex360</div>
            <div style={styles.subtitle}>Planejamento Financeiro</div>
          </div>
        </div>

        <nav style={styles.menu}>
          {menuItems.map((item) => (
            <div
              key={item.label}
              onClick={() => setPage(item.page)}
              style={{
                ...styles.menuItem,
                ...(currentPage === item.page ? styles.active : {}),
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </nav>
      </div>

      <button style={styles.premium}>⭐ Premium</button>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: "260px",
    minHeight: "100vh",
    background: "#071b45",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },

  brandBlock: {
    display: "flex",
    gap: "10px",
    marginBottom: "30px",
  },

  logoBox: {
    width: "50px",
    height: "50px",
    background: "#1e6bff",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  logoV: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: "24px",
  },

  logoText: {
    fontSize: "22px",
    fontWeight: "bold",
  },

  subtitle: {
    fontSize: "12px",
    color: "#aaa",
  },

  menu: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  menuItem: {
    padding: "12px",
    borderRadius: "10px",
    cursor: "pointer",
  },

  active: {
    background: "#1e6bff",
  },

  premium: {
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    background: "#1e6bff",
    color: "#fff",
    cursor: "pointer",
  },
};

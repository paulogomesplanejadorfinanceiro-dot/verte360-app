export default function Sidebar() {
  return (
    <div style={styles.sidebar}>
      <div style={styles.logo}>Vertex360</div>

      <div style={styles.menu}>
        <MenuItem icon="📊" label="Dashboard" active />
        <MenuItem icon="💰" label="Lançamentos" />
        <MenuItem icon="🎯" label="Metas" />
        <MenuItem icon="📅" label="Planejamento" />
        <MenuItem icon="📈" label="Relatórios" />
        <MenuItem icon="📚" label="Educação" />
        <MenuItem icon="⚙️" label="Configurações" />
      </div>

      <div style={styles.footer}>
        <button style={styles.upgrade}>
          ⭐ Premium
        </button>
      </div>
    </div>
  );
}

function MenuItem({ icon, label, active }) {
  return (
    <div
      style={{
        ...styles.item,
        background: active ? "rgba(30,107,255,0.2)" : "transparent",
      }}
    >
      <span style={styles.icon}>{icon}</span>
      <span>{label}</span>
    </div>
  );
}

const styles = {
  sidebar: {
    width: "240px",
    height: "100vh",
    background: "#06152d",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    borderRight: "1px solid rgba(255,255,255,0.05)",
  },

  logo: {
    fontSize: "22px",
    fontWeight: "700",
    marginBottom: "30px",
  },

  menu: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  item: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "0.2s",
  },

  icon: {
    fontSize: "18px",
  },

  footer: {
    marginTop: "20px",
  },

  upgrade: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    background: "#1e6bff",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
  },
};

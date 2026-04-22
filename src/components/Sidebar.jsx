export default function Sidebar() {
  const menuItems = [
    { icon: "📊", label: "Dashboard", active: true },
    { icon: "💰", label: "Lançamentos", active: true },
    { icon: "🎯", label: "Metas" },
    { icon: "📅", label: "Planejamento" },
    { icon: "📈", label: "Relatórios" },
    { icon: "📚", label: "Educação" },
    { icon: "⚙️", label: "Configurações" },
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
              style={{
                ...styles.menuItem,
                ...(item.active ? styles.menuItemActive : {}),
              }}
            >
              <span style={styles.menuIcon}>{item.icon}</span>
              <span style={styles.menuLabel}>{item.label}</span>
            </div>
          ))}
        </nav>
      </div>

      <div style={styles.footer}>
        <button style={styles.premiumButton}>⭐ Premium</button>
      </div>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: "260px",
    minHeight: "100vh",
    background:
      "linear-gradient(180deg, #0b2f7d 0%, #082866 35%, #071b45 100%)",
    padding: "24px 18px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    borderRight: "1px solid rgba(255,255,255,0.06)",
    boxShadow: "0 0 30px rgba(0,0,0,0.18)",
  },

  brandBlock: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "34px",
  },

  logoBox: {
    width: "58px",
    height: "58px",
    borderRadius: "18px",
    background: "linear-gradient(135deg, #0e44c9 0%, #3ec7ff 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 10px 24px rgba(0,0,0,0.22)",
    flexShrink: 0,
  },

  logoV: {
    fontSize: "34px",
    fontWeight: "800",
    color: "#ffffff",
    lineHeight: 1,
    fontFamily: "Arial, Helvetica, sans-serif",
  },

  logoText: {
    fontSize: "28px",
    fontWeight: "800",
    color: "#ffffff",
    lineHeight: 1.05,
  },

  subtitle: {
    fontSize: "12px",
    color: "#c7d7ff",
    marginTop: "4px",
    letterSpacing: "0.2px",
  },

  menu: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  menuItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "14px 14px",
    borderRadius: "14px",
    color: "#eef4ff",
    cursor: "pointer",
    transition: "0.2s ease",
  },

  menuItemActive: {
    background: "linear-gradient(90deg, rgba(33,111,255,0.40), rgba(33,111,255,0.18))",
    border: "1px solid rgba(105,167,255,0.18)",
    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.03)",
  },

  menuIcon: {
    fontSize: "18px",
    width: "20px",
    textAlign: "center",
  },

  menuLabel: {
    fontSize: "16px",
    fontWeight: "600",
  },

  footer: {
    marginTop: "24px",
  },

  premiumButton: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "14px",
    border: "none",
    background: "linear-gradient(90deg, #1e6bff 0%, #47bfff 100%)",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 12px 22px rgba(0,0,0,0.18)",
  },
};

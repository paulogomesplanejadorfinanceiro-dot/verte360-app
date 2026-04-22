export default function Sidebar({ setPage, currentPage }) {
  const menuItems = [
    { icon: "🏠", label: "Dashboard", page: "dashboard" },
    { icon: "📄", label: "Lançamentos", page: "lancamentos" },
    { icon: "🎯", label: "Metas", page: "metas" },
    { icon: "📅", label: "Planejamento", page: "planejamento" },
    { icon: "📈", label: "Relatórios", page: "relatorios" },
    { icon: "📊", label: "Investimentos", page: "investimentos" },
  ];

  return (
    <aside style={styles.sidebar}>
      <div>
        <div style={styles.logoArea}>
          <div style={styles.logoBox}>V</div>

          <div>
            <div style={styles.logoText}>
              Vertex<span style={styles.logoHighlight}>360</span>
            </div>
            <div style={styles.subText}>Planejamento Financeiro</div>
          </div>
        </div>

        <div style={styles.menuTitle}>MENU PRINCIPAL</div>

        <div style={styles.menu}>
          {menuItems.map((item) => (
            <div
              key={item.page}
              onClick={() => setPage(item.page)}
              style={{
                ...styles.menuItem,
                ...(currentPage === item.page ? styles.menuItemActive : {}),
              }}
            >
              <span style={styles.icon}>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}

          <div style={styles.educacaoRow}>
            <div
              onClick={() => setPage("educacao")}
              style={{
                ...styles.menuItem,
                ...(currentPage === "educacao" ? styles.menuItemActive : {}),
                marginBottom: 0,
                flex: 1,
              }}
            >
              <span style={styles.icon}>🎓</span>
              <span>Educação Financeira</span>
            </div>

            <span style={styles.premiumBadge}>PREMIUM</span>
          </div>
        </div>
      </div>

      <div style={styles.bottomArea}>
        <div style={styles.planCard}>
          <div style={styles.planIcon}>👑</div>
          <div style={styles.planSmall}>Você está no plano</div>
          <div style={styles.planName}>Básico</div>
          <div style={styles.planDesc}>
            Aproveite todos os benefícios do{" "}
            <span style={styles.planHighlight}>Premium!</span>
          </div>

          <button style={styles.planButton}>Ver planos e benefícios</button>
        </div>

        <div
          onClick={() => setPage("config")}
          style={{
            ...styles.configButton,
            ...(currentPage === "config" ? styles.configButtonActive : {}),
          }}
        >
          <span style={styles.icon}>⚙️</span>
          <span>Configurações</span>
        </div>
      </div>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: "290px",
    minWidth: "290px",
    height: "100vh",
    background: "linear-gradient(180deg, #04142b 0%, #041a36 45%, #03101f 100%)",
    color: "#ffffff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "22px 18px",
    borderRight: "1px solid rgba(85, 140, 255, 0.18)",
    boxShadow: "inset -1px 0 0 rgba(255,255,255,0.03)",
  },

  logoArea: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "28px",
  },

  logoBox: {
    width: "58px",
    height: "58px",
    borderRadius: "14px",
    background: "linear-gradient(135deg, #235dff 0%, #53c7ff 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "30px",
    fontWeight: "800",
    color: "#ffffff",
    boxShadow: "0 8px 18px rgba(18, 89, 255, 0.35)",
    flexShrink: 0,
  },

  logoText: {
    fontSize: "20px",
    fontWeight: "800",
    lineHeight: 1.1,
    color: "#ffffff",
  },

  logoHighlight: {
    color: "#3caeff",
  },

  subText: {
    fontSize: "12px",
    color: "#d6e4ff",
    marginTop: "4px",
  },

  menuTitle: {
    fontSize: "12px",
    letterSpacing: "0.8px",
    color: "#b6c6e5",
    marginBottom: "14px",
    textTransform: "uppercase",
  },

  menu: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  menuItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "14px 14px",
    borderRadius: "14px",
    cursor: "pointer",
    color: "#eef4ff",
    fontSize: "16px",
    fontWeight: "600",
    transition: "0.2s ease",
  },

  menuItemActive: {
    background:
      "linear-gradient(90deg, rgba(60,110,255,0.30) 0%, rgba(95,80,255,0.22) 100%)",
    boxShadow: "inset 0 0 0 1px rgba(120, 163, 255, 0.16)",
  },

  educacaoRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  icon: {
    width: "22px",
    textAlign: "center",
    fontSize: "18px",
    flexShrink: 0,
  },

  premiumBadge: {
    fontSize: "10px",
    fontWeight: "800",
    padding: "4px 8px",
    borderRadius: "8px",
    background: "linear-gradient(90deg, #7c3aed 0%, #a855f7 100%)",
    color: "#ffffff",
    letterSpacing: "0.5px",
    whiteSpace: "nowrap",
  },

  bottomArea: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
    marginTop: "20px",
  },

  planCard: {
    background:
      "linear-gradient(180deg, rgba(8,24,48,0.98) 0%, rgba(10,20,38,0.98) 100%)",
    border: "1px solid rgba(121, 156, 255, 0.16)",
    borderRadius: "16px",
    padding: "18px",
    boxShadow: "0 12px 24px rgba(0,0,0,0.24)",
  },

  planIcon: {
    width: "54px",
    height: "54px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #6d28d9 0%, #a855f7 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    marginBottom: "14px",
  },

  planSmall: {
    fontSize: "14px",
    color: "#d5def0",
    marginBottom: "4px",
  },

  planName: {
    fontSize: "20px",
    fontWeight: "800",
    color: "#ffffff",
    marginBottom: "8px",
  },

  planDesc: {
    fontSize: "14px",
    lineHeight: 1.5,
    color: "#d5def0",
    marginBottom: "16px",
  },

  planHighlight: {
    color: "#b56cff",
    fontWeight: "700",
  },

  planButton: {
    width: "100%",
    border: "none",
    borderRadius: "12px",
    padding: "13px 14px",
    background: "linear-gradient(90deg, #6d28d9 0%, #9333ea 100%)",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
  },

  configButton: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "16px 14px",
    borderRadius: "14px",
    cursor: "pointer",
    background:
      "linear-gradient(90deg, rgba(60,110,255,0.22) 0%, rgba(95,80,255,0.18) 100%)",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "700",
    boxShadow: "inset 0 0 0 1px rgba(120, 163, 255, 0.12)",
  },

  configButtonActive: {
    boxShadow: "inset 0 0 0 1px rgba(140, 176, 255, 0.28)",
  },
};

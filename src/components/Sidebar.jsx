import { useState } from "react";

export default function Sidebar({ setPage, currentPage, isMobile }) {
  const [menuAberto, setMenuAberto] = useState(false);

  const menuItems = [
    { icon: "🏠", label: "Dashboard", page: "dashboard" },
    { icon: "💰", label: "Lançamentos", page: "lancamentos" },
    { icon: "🎯", label: "Metas", page: "metas" },
    { icon: "📅", label: "Planejamento", page: "planejamento" },
    { icon: "📈", label: "Relatórios", page: "relatorios" },
    { icon: "📊", label: "Investimentos", page: "investimentos" },
  ];

  function handlePageChange(page) {
    setPage(page);
    if (isMobile) {
      setMenuAberto(false);
    }
  }

  if (isMobile) {
    return (
      <>
        <div style={styles.mobileTopbar}>
          <div style={styles.mobileBrandArea}>
            <div style={styles.mobileLogoBox}>V</div>
            <div>
              <div style={styles.mobileBrand}>Vertex360</div>
              <div style={styles.mobileSubBrand}>Planejamento Financeiro</div>
            </div>
          </div>

          <button
            style={styles.mobileMenuButton}
            onClick={() => setMenuAberto(!menuAberto)}
          >
            ☰
          </button>
        </div>

        {menuAberto && (
          <div
            style={styles.mobileOverlay}
            onClick={() => setMenuAberto(false)}
          >
            <div
              style={styles.mobileDrawer}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={styles.mobileDrawerHeader}>Menu</div>

              <div style={styles.menu}>
                {menuItems.map((item) => (
                  <div
                    key={item.page}
                    onClick={() => handlePageChange(item.page)}
                    style={{
                      ...styles.menuItem,
                      ...(currentPage === item.page ? styles.menuItemActive : {}),
                    }}
                  >
                    <span style={styles.icon}>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>

              <div style={styles.mobileFooterCard}>
                <div style={styles.mobileFooterTitle}>Plano atual</div>
                <div style={styles.mobileFooterText}>Básico</div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

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
              onClick={() => handlePageChange(item.page)}
              style={{
                ...styles.menuItem,
                ...(currentPage === item.page ? styles.menuItemActive : {}),
              }}
            >
              <span style={styles.icon}>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
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
      </div>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: "290px",
    minWidth: "290px",
    minHeight: "100vh",
    background: "linear-gradient(180deg, #04142b 0%, #041a36 45%, #03101f 100%)",
    color: "#ffffff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "22px 18px",
    borderRight: "1px solid rgba(85, 140, 255, 0.18)",
    boxShadow: "inset -1px 0 0 rgba(255,255,255,0.03)",
    boxSizing: "border-box",
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
    userSelect: "none",
  },

  menuItemActive: {
    background:
      "linear-gradient(90deg, rgba(60,110,255,0.30) 0%, rgba(95,80,255,0.22) 100%)",
    boxShadow: "inset 0 0 0 1px rgba(120, 163, 255, 0.16)",
  },

  icon: {
    width: "22px",
    textAlign: "center",
    fontSize: "18px",
    flexShrink: 0,
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

  mobileTopbar: {
    position: "sticky",
    top: 0,
    zIndex: 50,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 16px",
    background: "#08162f",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },

  mobileBrandArea: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  mobileLogoBox: {
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #235dff 0%, #53c7ff 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
    fontWeight: "800",
    color: "#ffffff",
    flexShrink: 0,
  },

  mobileBrand: {
    fontSize: "18px",
    fontWeight: "800",
    color: "#ffffff",
    lineHeight: 1.1,
  },

  mobileSubBrand: {
    fontSize: "11px",
    color: "#d6e4ff",
    marginTop: "2px",
  },

  mobileMenuButton: {
    border: "none",
    background: "#2563eb",
    color: "#ffffff",
    width: "42px",
    height: "42px",
    borderRadius: "10px",
    fontSize: "20px",
    cursor: "pointer",
  },

  mobileOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    zIndex: 60,
  },

  mobileDrawer: {
    width: "280px",
    maxWidth: "82%",
    height: "100%",
    background: "#0b1d38",
    padding: "18px 14px",
    boxSizing: "border-box",
    boxShadow: "10px 0 30px rgba(0,0,0,0.35)",
  },

  mobileDrawerHeader: {
    fontSize: "22px",
    fontWeight: "800",
    color: "#ffffff",
    marginBottom: "18px",
  },

  mobileFooterCard: {
    marginTop: "22px",
    background: "#10284d",
    borderRadius: "14px",
    padding: "14px",
    color: "#dce8ff",
  },

  mobileFooterTitle: {
    fontSize: "13px",
    color: "#b7c8e8",
    marginBottom: "4px",
  },

  mobileFooterText: {
    fontSize: "18px",
    fontWeight: "800",
    color: "#ffffff",
  },
};

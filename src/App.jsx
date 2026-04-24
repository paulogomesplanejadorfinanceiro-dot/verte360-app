import { useState } from "react";
import Sidebar from "./components/Sidebar";

// Páginas
import Dashboard from "./pages/Dashboard";
import Lancamentos from "./pages/Lancamentos";
import Metas from "./pages/Metas";
import Planejamento from "./pages/Planejamento";
import Relatorios from "./pages/Relatorios";
import EducacaoFinanceira from "./pages/EducacaoFinanceira";
import EmBranco from "./pages/EmBranco"; // 🔥 INVESTIMENTOS

export default function App() {
  const [pagina, setPagina] = useState("dashboard");

  function renderPagina() {
    switch (pagina) {
      case "dashboard":
        return <Dashboard />;

      case "lancamentos":
        return <Lancamentos />;

      case "metas":
        return <Metas />;

      case "planejamento":
        return <Planejamento />;

      case "relatorios":
        return <Relatorios />;

      case "investimentos":
        return <EmBranco />;

      case "educacao":
        return <EducacaoFinanceira />;

      default:
        return <Dashboard />;
    }
  }

  return (
    <div style={styles.container}>
      {/* 🔥 Sidebar conectado corretamente */}
      <Sidebar setPage={setPagina} currentPage={pagina} />

      {/* 🔥 Área principal */}
      <main style={styles.main}>
        {renderPagina()}
      </main>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    background: "#020617", // 🔥 padrão profissional dark
  },
  main: {
    flex: 1,
    padding: "25px",
  },
};

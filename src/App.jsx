import { useState } from "react";
import Sidebar from "./components/Sidebar";

// Páginas
import Dashboard from "./pages/Dashboard";
import Lancamentos from "./pages/Lancamentos";
import Metas from "./pages/Metas";
import Planejamento from "./pages/Planejamento";
import Relatorios from "./pages/Relatorios";
import EducacaoFinanceira from "./pages/EducacaoFinanceira";
import EmBranco from "./pages/EmBranco";

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

      case "educacao":
        return <EducacaoFinanceira />;

      case "investimentos":
        return <EmBranco />;

      default:
        return <Dashboard />;
    }
  }

  return (
    <div style={styles.container}>
      <Sidebar setPage={setPagina} currentPage={pagina} />

      <div style={styles.content}>
        {renderPagina()}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    background: "#0f172a"
  },
  content: {
    flex: 1,
    padding: 20
  }
};

import { useState } from "react";
import Sidebar from "./components/Sidebar";

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
        return <EmBranco />; // 🔥 aqui é sua aba de investimentos

      case "educacao":
        return <EducacaoFinanceira />;

      default:
        return <Dashboard />;
    }
  }

  return (
    <div style={styles.container}>
      <Sidebar setPage={setPagina} currentPage={pagina} />

      <main style={styles.main}>
        {renderPagina()}
      </main>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    background: "#0f172a",
    minHeight: "100vh",
  },
  main: {
    flex: 1,
    padding: "20px",
  },
};

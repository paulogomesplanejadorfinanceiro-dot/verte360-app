import { useState } from "react";
import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Lancamentos from "./pages/Lancamentos";
import Relatorios from "./pages/Relatorios";
import Metas from "./pages/Metas";
import Investimentos from "./pages/Investimentos";
import Planejamento from "./pages/Planejamento";

export default function App() {
  const [page, setPage] = useState("dashboard");

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <Dashboard />;
      case "lancamentos": return <Lancamentos />;
      case "relatorios": return <Relatorios />;
      case "metas": return <Metas />;
      case "investimentos": return <Investimentos />;
      case "planejamento": return <Planejamento />;
      default: return <Dashboard />;
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar setPage={setPage} />
      <div style={{ flex: 1, padding: 20 }}>
        {renderPage()}
      </div>
    </div>
  );
}

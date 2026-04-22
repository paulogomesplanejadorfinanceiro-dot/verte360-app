import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Lancamentos from "./pages/Lancamentos";
import "./app.css";

export default function App() {
  const [page, setPage] = useState("dashboard");

  function renderPage() {
    switch (page) {
      case "lancamentos":
        return <Lancamentos />;
      default:
        return <Dashboard />;
    }
  }

  return (
    <div style={{ display: "flex" }}>
      <Sidebar setPage={setPage} currentPage={page} />

      <div style={{ flex: 1 }}>
        {renderPage()}
      </div>
    </div>
  );
}

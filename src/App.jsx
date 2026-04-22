import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Lancamentos from "./pages/Lancamentos";
import "./app.css";

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [lancamentos, setLancamentos] = useState([]);

  function adicionarLancamento(novoLancamento) {
    setLancamentos((prev) => [novoLancamento, ...prev]);
  }

  function removerLancamento(id) {
    setLancamentos((prev) => prev.filter((item) => item.id !== id));
  }

  const receitas = lancamentos
    .filter((item) => item.tipo === "receita")
    .reduce((acc, item) => acc + item.valor, 0);

  const despesas = lancamentos
    .filter((item) => item.tipo === "despesa")
    .reduce((acc, item) => acc + item.valor, 0);

  const saldo = receitas - despesas;

  function renderPage() {
    switch (page) {
      case "lancamentos":
        return (
          <Lancamentos
            lancamentos={lancamentos}
            receitas={receitas}
            despesas={despesas}
            saldo={saldo}
            onAddLancamento={adicionarLancamento}
            onRemoveLancamento={removerLancamento}
          />
        );

      default:
        return (
          <Dashboard
            lancamentos={lancamentos}
            receitas={receitas}
            despesas={despesas}
            saldo={saldo}
          />
        );
    }
  }

  return (
    <div style={styles.app}>
      <Sidebar setPage={setPage} currentPage={page} />

      <main style={styles.content}>
        {renderPage()}
      </main>
    </div>
  );
}

const styles = {
  app: {
    display: "flex",
    minHeight: "100vh",
    background: "#07152d",
    color: "#ffffff",
  },

  content: {
    flex: 1,
  },
};

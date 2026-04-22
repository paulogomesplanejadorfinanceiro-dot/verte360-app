import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Lancamentos from "./pages/Lancamentos";
import Investimentos from "./pages/Investimentos.jsx";
import { supabase } from "./services/supabase";
import "./app.css";

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [lancamentos, setLancamentos] = useState([]);
  const [loading, setLoading] = useState(false);

  async function buscarLancamentos() {
    setLoading(true);

    const { data, error } = await supabase
      .from("movimentacoes")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) {
      setLancamentos(data || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    buscarLancamentos();
  }, []);

  const receitas = lancamentos
    .filter((i) => i.tipo === "receita")
    .reduce((acc, i) => acc + Number(i.valor || 0), 0);

  const despesas = lancamentos
    .filter((i) => i.tipo === "despesa")
    .reduce((acc, i) => acc + Number(i.valor || 0), 0);

  const saldo = receitas - despesas;

  function renderPage() {
    if (page === "dashboard") {
      return (
        <Dashboard
          lancamentos={lancamentos}
          receitas={receitas}
          despesas={despesas}
          saldo={saldo}
        />
      );
    }

    if (page === "lancamentos") {
      return (
        <Lancamentos
          lancamentos={lancamentos}
          receitas={receitas}
          despesas={despesas}
          saldo={saldo}
        />
      );
    }

    if (page === "investimentos") {
      return <Investimentos />;
    }

    return <Dashboard />;
  }

  return (
    <div style={{ display: "flex" }}>
      <Sidebar setPage={setPage} currentPage={page} />
      <div style={{ flex: 1 }}>{renderPage()}</div>
    </div>
  );
}

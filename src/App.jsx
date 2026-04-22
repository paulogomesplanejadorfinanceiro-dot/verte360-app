import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Lancamentos from "./pages/Lancamentos";
import Investimentos from "./pages/Investimentos";
import { supabase } from "./services/supabase";
import "./App.css";

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [lancamentos, setLancamentos] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔥 BUSCAR DADOS
  async function buscarLancamentos() {
    setLoading(true);

    const { data, error } = await supabase
      .from("movimentacoes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar:", error);
    } else {
      setLancamentos(data || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    buscarLancamentos();
  }, []);

  // 🔥 CALCULOS
  const receitas = lancamentos
    .filter((l) => l.tipo === "receita")
    .reduce((acc, l) => acc + Number(l.valor), 0);

  const despesas = lancamentos
    .filter((l) => l.tipo === "despesa")
    .reduce((acc, l) => acc + Number(l.valor), 0);

  const saldo = receitas - despesas;

  // 🔥 FUNÇÃO CORRETA DE RENDER
  function renderPage() {
    if (page === "dashboard") {
      return <Dashboard receitas={receitas} despesas={despesas} saldo={saldo} />;
    }

    if (page === "lancamentos") {
      return (
        <Lancamentos
          lancamentos={lancamentos}
          receitas={receitas}
          despesas={despesas}
          saldo={saldo}
          atualizar={buscarLancamentos}
        />
      );
    }

    if (page === "investimentos") {
      return <Investimentos />;
    }

    return <Dashboard />;
  }

  // 🔥 RENDER PRINCIPAL (NUNCA QUEBRA ISSO)
  return (
    <div style={{ display: "flex" }}>
      <Sidebar setPage={setPage} currentPage={page} />

      <div style={{ flex: 1 }}>
        {renderPage()}
      </div>
    </div>
  );
}

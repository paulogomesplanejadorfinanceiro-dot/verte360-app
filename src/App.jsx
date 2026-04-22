import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Lancamentos from "./pages/Lancamentos";
import { supabase } from "./services/supabase";
import "./app.css";

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [lancamentos, setLancamentos] = useState([]);

  // 🔥 BUSCAR DADOS DO SUPABASE
  async function buscarLancamentos() {
    const { data, error } = await supabase
      .from("movimentacoes")
      .select("*")
      .order("id", { ascending: false });

    if (!error) {
      setLancamentos(data);
    }
  }

  // 🔥 CARREGA AO INICIAR
  useEffect(() => {
    buscarLancamentos();
  }, []);

  // 🔥 ADICIONAR
  async function adicionarLancamento(novo) {
    const { error } = await supabase
      .from("movimentacoes")
      .insert([novo]);

    if (!error) {
      buscarLancamentos();
    }
  }

  // 🔥 REMOVER
  async function removerLancamento(id) {
    const { error } = await supabase
      .from("movimentacoes")
      .delete()
      .eq("id", id);

    if (!error) {
      buscarLancamentos();
    }
  }

  // 🔥 CALCULOS AUTOMATICOS
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
            receitas={receitas}
            despesas={despesas}
            saldo={saldo}
          />
        );
    }
  }

  return (
    <div style={{ display: "flex" }}>
      <Sidebar setPage={setPage} currentPage={page} />
      {renderPage()}
    </div>
  );
}

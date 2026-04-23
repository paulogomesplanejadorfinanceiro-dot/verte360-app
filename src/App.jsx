import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Lancamentos from "./pages/Lancamentos";
import Metas from "./pages/Metas";
import Planejamento from "./pages/Planejamento";
import EmBranco from "./pages/EmBranco";
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

    if (error) {
      console.error("Erro ao buscar movimentações:", error);
    } else {
      setLancamentos(data || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    buscarLancamentos();
  }, []);

  async function adicionarLancamento(novo) {
    const payload = {
      descricao: novo.descricao || "Sem descrição",
      tipo: novo.tipo,
      valor: Number(novo.valor),
      user_id: null,
    };

    const { error } = await supabase
      .from("movimentacoes")
      .insert([payload]);

    if (error) {
      console.error("Erro ao salvar movimentação:", error);
      alert(`Erro ao salvar lançamento: ${error.message}`);
      return;
    }

    await buscarLancamentos();
  }

  async function removerLancamento(id) {
    const { error } = await supabase
      .from("movimentacoes")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Erro ao remover movimentação:", error);
      alert(`Erro ao remover lançamento: ${error.message}`);
      return;
    }

    await buscarLancamentos();
  }

  const receitas = lancamentos
    .filter((item) => item.tipo === "receita")
    .reduce((acc, item) => acc + Number(item.valor || 0), 0);

  const despesas = lancamentos
    .filter((item) => item.tipo === "despesa")
    .reduce((acc, item) => acc + Number(item.valor || 0), 0);

  const saldo = receitas - despesas;

  function renderPage() {
    if (page === "lancamentos") {
      return (
        <Lancamentos
          lancamentos={lancamentos}
          receitas={receitas}
          despesas={despesas}
          saldo={saldo}
          onAddLancamento={adicionarLancamento}
          onRemoveLancamento={removerLancamento}
          loading={loading}
        />
      );
    }

    if (page === "metas") {
      return <Metas />;
    }

    if (page === "planejamento") {
      return <Planejamento />;
    }

    if (page === "investimentos") {
      return <EmBranco />;
    }

    return (
      <Dashboard
        lancamentos={lancamentos}
        receitas={receitas}
        despesas={despesas}
        saldo={saldo}
      />
    );
  }

  return (
    <div style={styles.app}>
      <Sidebar setPage={setPage} currentPage={page} />
      <main style={styles.content}>{renderPage()}</main>
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
    minWidth: 0,
    width: "100%",
  },
};

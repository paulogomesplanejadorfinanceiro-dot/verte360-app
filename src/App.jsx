import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Lancamentos from "./pages/Lancamentos";
import Investimentos from "./pages/Investimentos.jsx";
import EmBranco from "./pages/EmBranco";
import { supabase } from "./services/supabase";
import "./app.css";

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [lancamentos, setLancamentos] = useState([]);
  const [loading, setLoading] = useState(false);

  async function buscarLancamentos() {
    setLoading(true);

    const { data } = await supabase
      .from("movimentacoes")
      .select("*")
      .order("created_at", { ascending: false });

    setLancamentos(data || []);
    setLoading(false);
  }

  useEffect(() => {
    buscarLancamentos();
  }, []);

  async function adicionarLancamento(novo) {
    await supabase.from("movimentacoes").insert([
      {
        descricao: novo.descricao,
        tipo: novo.tipo,
        valor: Number(novo.valor),
      },
    ]);

    await buscarLancamentos();
  }

  async function removerLancamento(id) {
    await supabase.from("movimentacoes").delete().eq("id", id);
    await buscarLancamentos();
  }

  const receitas = lancamentos
    .filter((i) => i.tipo === "receita")
    .reduce((a, i) => a + Number(i.valor), 0);

  const despesas = lancamentos
    .filter((i) => i.tipo === "despesa")
    .reduce((a, i) => a + Number(i.valor), 0);

  const saldo = receitas - despesas;

  function renderPage() {
    switch (page) {
      case "dashboard":
        return (
          <Dashboard
            lancamentos={lancamentos}
            receitas={receitas}
            despesas={despesas}
            saldo={saldo}
          />
        );

      case "lancamentos":
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

      case "investimentos":
        return <Investimentos />;

      case "metas":
        return <EmBranco titulo="Metas" />;

      case "planejamento":
        return <EmBranco titulo="Planejamento" />;

      case "relatorios":
        return <EmBranco titulo="Relatórios" />;

      case "educacao":
        return <EmBranco titulo="Educação Financeira" />;

      case "config":
        return <EmBranco titulo="Configurações" />;

      default:
        return <Dashboard />;
    }
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
  },

  content: {
    flex: 1,
  },
};

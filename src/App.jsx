import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Lancamentos from "./pages/Lancamentos";
import Metas from "./pages/Metas";
import Planejamento from "./pages/Planejamento";
import EmBranco from "./pages/EmBranco";
import Relatorios from "./pages/Relatorios";
import { supabase } from "./services/supabase";
import "./app.css";

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [lancamentos, setLancamentos] = useState([]);
  const [metas, setMetas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMetas, setLoadingMetas] = useState(false);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 768 : false
  );

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

  async function buscarMetas() {
    setLoadingMetas(true);

    const { data, error } = await supabase
      .from("metas")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar metas:", error);
    } else {
      setMetas(data || []);
    }

    setLoadingMetas(false);
  }

  useEffect(() => {
    buscarLancamentos();
    buscarMetas();

    function handleResize() {
      setIsMobile(window.innerWidth <= 768);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  async function adicionarLancamento(novo) {
    const payload = {
      descricao: novo.descricao || "Sem descrição",
      tipo: novo.tipo,
      valor: Number(novo.valor),
      data_lancamento:
        novo.data_lancamento || new Date().toISOString().slice(0, 10),
      recorrente: Boolean(novo.recorrente),
      dia_vencimento:
        novo.recorrente && novo.dia_vencimento
          ? Number(novo.dia_vencimento)
          : null,
      user_id: null,
    };

    const { error } = await supabase.from("movimentacoes").insert([payload]);

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

  async function adicionarMeta(novaMeta) {
    const payload = {
      titulo: novaMeta.titulo,
      valor_objetivo: Number(novaMeta.valor_objetivo),
      valor_atual: Number(novaMeta.valor_atual || 0),
      user_id: null,
    };

    const { error } = await supabase.from("metas").insert([payload]);

    if (error) {
      console.error("Erro ao salvar meta:", error);
      alert(`Erro ao salvar meta: ${error.message}`);
      return;
    }

    await buscarMetas();
  }

  async function removerMeta(id) {
    const { error } = await supabase.from("metas").delete().eq("id", id);

    if (error) {
      console.error("Erro ao remover meta:", error);
      alert(`Erro ao remover meta: ${error.message}`);
      return;
    }

    await buscarMetas();
  }

  async function adicionarValorMeta(id, valorAdicional) {
    const meta = metas.find((item) => item.id === id);

    if (!meta) return;

    const novoValorAtual =
      Number(meta.valor_atual || 0) + Number(valorAdicional || 0);

    const { error } = await supabase
      .from("metas")
      .update({ valor_atual: novoValorAtual })
      .eq("id", id);

    if (error) {
      console.error("Erro ao atualizar valor da meta:", error);
      alert(`Erro ao atualizar meta: ${error.message}`);
      return;
    }

    await buscarMetas();
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
      return (
        <Metas
          metas={metas}
          onAddMeta={adicionarMeta}
          onRemoveMeta={removerMeta}
          onAddValorMeta={adicionarValorMeta}
          loading={loadingMetas}
        />
      );
    }

    if (page === "planejamento") {
      return <Planejamento />;
    }

    if (page === "investimentos") {
      return <EmBranco />;
    }

    if (page === "relatorios") {
      return <Relatorios lancamentos={lancamentos} />;
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
    <div
      style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        minHeight: "100vh",
        background: "#07152d",
        color: "#ffffff",
      }}
    >
      <Sidebar
        setPage={setPage}
        currentPage={page}
        isMobile={isMobile}
      />

      <main
        style={{
          flex: 1,
          minWidth: 0,
          width: "100%",
        }}
      >
        {renderPage()}
      </main>
    </div>
  );
}

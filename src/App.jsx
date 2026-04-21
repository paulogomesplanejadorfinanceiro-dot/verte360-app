import { useEffect, useMemo, useState } from "react";
import { supabase } from "./services/supabase";
import "./app.css";

const WHATSAPP_NUMBER = "5511987835736";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("vertex360_transactions");
    return saved ? JSON.parse(saved) : [];
  });

  const [tipo, setTipo] = useState("receita");
  const [valor, setValor] = useState("");
  const [descricao, setDescricao] = useState("");
  const [data, setData] = useState(new Date().toISOString().slice(0, 10));

  const [agNome, setAgNome] = useState("");
  const [agData, setAgData] = useState("");
  const [agHora, setAgHora] = useState("");

  useEffect(() => {
    localStorage.setItem("vertex360_transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      setLoading(true);

      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Erro ao buscar sessão:", error.message);
      }

      if (!mounted) return;

      setUser(data?.session?.user ?? null);
      setLoading(false);
    }

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleLogin() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      alert("Erro ao entrar com Google: " + error.message);
      console.error(error);
    }
  }

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      alert("Erro ao sair: " + error.message);
      console.error(error);
    }
  }

  function adicionarLancamento(e) {
    e.preventDefault();

    if (!valor || !descricao || !data) {
      alert("Preencha valor, descrição e data.");
      return;
    }

    const novo = {
      id: Date.now(),
      tipo,
      valor: Number(valor),
      descricao,
      data,
    };

    setTransactions((prev) => [novo, ...prev]);
    setValor("");
    setDescricao("");
    setData(new Date().toISOString().slice(0, 10));
  }

  function removerLancamento(id) {
    setTransactions((prev) => prev.filter((item) => item.id !== id));
  }

  const receitas = useMemo(() => {
    return transactions
      .filter((item) => item.tipo === "receita")
      .reduce((acc, item) => acc + item.valor, 0);
  }, [transactions]);

  const despesas = useMemo(() => {
    return transactions
      .filter((item) => item.tipo === "despesa")
      .reduce((acc, item) => acc + item.valor, 0);
  }, [transactions]);

  const saldo = receitas - despesas;

  function enviarAgendamentoWhatsApp(e) {
    e.preventDefault();

    if (!agNome || !agData || !agHora) {
      alert("Preencha nome, data e horário.");
      return;
    }

    const texto = `Olá, me chamo ${agNome}. Gostaria de agendar uma consultoria.\nData: ${agData}\nHorário: ${agHora}`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`;
    window.open(url, "_blank");
  }

  if (loading) {
    return (
      <div className="login-page">
        <div className="login-card">
          <h1>Vertex360</h1>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="login-page">
        <div className="login-card">
          <h1>Vertex360</h1>
          <p>Planejamento Financeiro</p>
          <button className="primary-btn" onClick={handleLogin}>
            Entrar com Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <h2>Vertex360</h2>
        <p>{user.user_metadata?.full_name || user.email}</p>
        <nav>
          <a href="#menu">Menu</a>
          <a href="#planejamento">Planejamento</a>
          <a href="#metas">Metas</a>
          <a href="#lancamentos">Lançamentos</a>
        </nav>
        <button className="secondary-btn" onClick={handleLogout}>
          Sair
        </button>
      </aside>

      <main className="content">
        <section id="menu" className="card">
          <h2>Resumo financeiro</h2>
          <div className="summary-grid">
            <div className="summary-box">
              <span>Receitas</span>
              <strong>
                {receitas.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </strong>
            </div>

            <div className="summary-box">
              <span>Despesas</span>
              <strong>
                {despesas.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </strong>
            </div>

            <div className="summary-box">
              <span>Saldo</span>
              <strong>
                {saldo.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </strong>
            </div>
          </div>
        </section>

        <section id="planejamento" className="card">
          <h2>Agendar consultoria</h2>
          <form onSubmit={enviarAgendamentoWhatsApp} className="form-grid">
            <input
              type="text"
              placeholder="Seu nome"
              value={agNome}
              onChange={(e) => setAgNome(e.target.value)}
            />
            <input
              type="date"
              value={agData}
              onChange={(e) => setAgData(e.target.value)}
            />
            <input
              type="time"
              value={agHora}
              onChange={(e) => setAgHora(e.target.value)}
            />
            <button className="primary-btn" type="submit">
              Agendar no WhatsApp
            </button>
          </form>
        </section>

        <section id="lancamentos" className="card">
          <h2>Adicionar lançamento</h2>
          <form onSubmit={adicionarLancamento} className="form-grid">
            <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
              <option value="receita">Receita</option>
              <option value="despesa">Despesa</option>
            </select>

            <input
              type="number"
              step="0.01"
              placeholder="Valor"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
            />

            <input
              type="text"
              placeholder="Descrição"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />

            <input
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
            />

            <button className="primary-btn" type="submit">
              Salvar lançamento
            </button>
          </form>
        </section>

        <section id="metas" className="card">
          <h2>Histórico</h2>
          {transactions.length === 0 ? (
            <p>Nenhum lançamento ainda.</p>
          ) : (
            <div className="list">
              {transactions.map((item) => (
                <div key={item.id} className="list-item">
                  <div>
                    <strong>{item.descricao}</strong>
                    <p>
                      {item.tipo} • {item.data}
                    </p>
                  </div>
                  <div className="item-actions">
                    <span>
                      {item.valor.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </span>
                    <button onClick={() => removerLancamento(item.id)}>
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

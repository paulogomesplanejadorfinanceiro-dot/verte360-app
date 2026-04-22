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
    async function initAuth() {
      try {
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");

        // 1) Se voltou do Google com ?code=..., troca por sessão
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            console.error("Erro ao trocar code por sessão:", error.message);
          } else {
            // limpa o ?code=... da barra
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        }

        // 2) Busca a sessão atual
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("Erro ao obter sessão:", sessionError.message);
        }

        setUser(session?.user ?? null);

        // 3) Escuta mudanças de autenticação
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
          setUser(session?.user ?? null);
        });

        return () => {
          subscription.unsubscribe();
        };
      } catch (err) {
        console.error("Erro geral na autenticação:", err);
      } finally {
        setLoading(false);
      }
    }

    initAuth();
  }, []);

  async function handleLogin() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "https://app.vertex360planejamento.com.br",
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

    const valorNumero = Number(String(valor).replace(",", "."));

    if (!descricao.trim() || !valorNumero || !data) {
      alert("Preencha descrição, valor e data.");
      return;
    }

    const novo = {
      id: Date.now(),
      tipo,
      descricao: descricao.trim(),
      valor: valorNumero,
      data,
    };

    setTransactions((prev) => [novo, ...prev]);
    setDescricao("");
    setValor("");
    setData(new Date().toISOString().slice(0, 10));
  }

  function removerLancamento(id) {
    setTransactions((prev) => prev.filter((item) => item.id !== id));
  }

  const receitas = useMemo(
    () =>
      transactions
        .filter((item) => item.tipo === "receita")
        .reduce((acc, item) => acc + item.valor, 0),
    [transactions]
  );

  const despesas = useMemo(
    () =>
      transactions
        .filter((item) => item.tipo === "despesa")
        .reduce((acc, item) => acc + item.valor, 0),
    [transactions]
  );

  const saldo = receitas - despesas;

  function agendarWhatsapp() {
    if (!agNome.trim() || !agData || !agHora) {
      alert("Preencha nome, data e horário.");
      return;
    }

    const mensagem = `Olá, meu nome é ${agNome}. Gostaria de agendar uma consultoria no dia ${agData} às ${agHora}.`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`;
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
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">Vertex360</div>
        <nav className="menu">
          <a href="#menu">Menu</a>
          <a href="#planejamento">Planejamento</a>
          <a href="#meta">Meta</a>
          <a href="#lancamentos">Lançamentos</a>
        </nav>

        <div className="user-box">
          <span>{user.email}</span>
          <button className="secondary-btn" onClick={handleLogout}>
            Sair
          </button>
        </div>
      </aside>

      <main className="content">
        <section id="menu" className="card">
          <h2>Resumo financeiro</h2>

          <div className="summary-grid">
            <div className="summary-card receita">
              <span>Receitas</span>
              <strong>R$ {receitas.toFixed(2)}</strong>
            </div>
            <div className="summary-card despesa">
              <span>Despesas</span>
              <strong>R$ {despesas.toFixed(2)}</strong>
            </div>
            <div className="summary-card saldo">
              <span>Saldo</span>
              <strong>R$ {saldo.toFixed(2)}</strong>
            </div>
          </div>
        </section>

        <section id="planejamento" className="card">
          <h2>Agendar consultoria</h2>

          <div className="form-grid">
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
          </div>

          <button className="primary-btn" onClick={agendarWhatsapp}>
            Agendar pelo WhatsApp
          </button>
        </section>

        <section id="meta" className="card">
          <h2>Evolução</h2>
          <p>
            Aqui você acompanha seu saldo atual e sua evolução financeira com base
            nas receitas e despesas lançadas.
          </p>
        </section>

        <section id="lancamentos" className="card">
          <h2>Novo lançamento</h2>

          <form onSubmit={adicionarLancamento} className="form-grid">
            <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
              <option value="receita">Receita</option>
              <option value="despesa">Despesa</option>
            </select>

            <input
              type="text"
              placeholder="Descrição"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />

            <input
              type="number"
              step="0.01"
              placeholder="Valor"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
            />

            <input
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
            />

            <button type="submit" className="primary-btn">
              Adicionar
            </button>
          </form>
        </section>

        <section className="card">
          <h2>Lista de lançamentos</h2>

          {transactions.length === 0 ? (
            <p>Nenhum lançamento ainda.</p>
          ) : (
            <div className="list">
              {transactions.map((item) => (
                <div key={item.id} className="list-item">
                  <div>
                    <strong>{item.descricao}</strong>
                    <span>
                      {item.tipo} • {item.data}
                    </span>
                  </div>

                  <div className="list-actions">
                    <strong>
                      {item.tipo === "despesa" ? "-" : "+"} R$ {item.valor.toFixed(2)}
                    </strong>
                    <button
                      className="danger-btn"
                      onClick={() => removerLancamento(item.id)}
                    >
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

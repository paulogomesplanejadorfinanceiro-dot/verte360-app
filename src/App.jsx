import { useState, useEffect } from "react";
import { supabase } from "./services/supabase";

export default function App() {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState("receita");
  const [meta, setMeta] = useState(3000);

  useEffect(() => {
    getUser();
  }, []);

  async function getUser() {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      console.log("Erro ao pegar usuário:", error);
      return;
    }

    if (data?.user) {
      setUser(data.user);
      fetchTransactions(data.user.id);
    }
  }

  async function fetchTransactions(userId) {
    const { data } = await supabase
      .from("movimentacoes")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    setTransactions(data || []);
  }

  async function addTransaction() {
    if (!valor || !user) return;

    await supabase.from("movimentacoes").insert([
      {
        user_id: user.id,
        valor: Number(valor),
        tipo,
      },
    ]);

    setValor("");
    fetchTransactions(user.id);
  }

  function formatMoney(value) {
    return Number(value || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  const receita = transactions
    .filter((t) => t.tipo === "receita")
    .reduce((acc, t) => acc + Number(t.valor || 0), 0);

  const despesa = transactions
    .filter((t) => t.tipo === "despesa")
    .reduce((acc, t) => acc + Number(t.valor || 0), 0);

  const saldo = receita - despesa;
  const progresso = meta > 0 ? Math.min((receita / meta) * 100, 100) : 0;

  async function handleLogin() {
    const email = prompt("Digite seu email");
    if (!email) return;

    await supabase.auth.signInWithOtp({ email });
    alert("Link enviado para o email.");
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
  }

  // LOGIN
  if (!user) {
    return (
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <button onClick={handleLogin}>Entrar no Vertex360</button>
      </div>
    );
  }

  // APP
  return (
    <div className="app">
      <div className="sidebar">
        <h1>Vertex360</h1>
        <p>Planejamento Financeiro</p>

        <button>Dashboard</button>
        <button>Lançamentos</button>
        <button>Metas</button>
        <button>Configurações</button>

        <p style={{ marginTop: "auto" }}>{user.email}</p>
        <button onClick={handleLogout}>Sair</button>
      </div>

      <div className="main-content">
        <div className="cards-grid">
          <div className="card">
            <h3>Receita</h3>
            <h2>{formatMoney(receita)}</h2>
          </div>

          <div className="card">
            <h3>Despesa</h3>
            <h2>{formatMoney(despesa)}</h2>
          </div>

          <div className="card">
            <h3>Saldo</h3>
            <h2>{formatMoney(saldo)}</h2>
          </div>
        </div>

        <div className="meta-card">
          <h3>Meta mensal</h3>

          <input
            type="number"
            value={meta}
            onChange={(e) => setMeta(Number(e.target.value))}
          />

          <div className="progress-bar">
            <div style={{ width: `${progresso}%` }} />
          </div>

          <p>{formatMoney(receita)} de {formatMoney(meta)}</p>
        </div>

        {/* WHATSAPP E MENTORIA */}
        <div className="support-section">
          <div className="support-card">
            <h3>WhatsApp</h3>
            <p>Fale comigo direto</p>

            <a
              href="https://wa.me/5511987835736?text=Olá,%20vim%20pelo%20Vertex360"
              target="_blank"
            >
              <button>Falar agora</button>
            </a>
          </div>

          <div className="support-card">
            <h3>Mentoria</h3>
            <p>Agende uma conversa</p>

            <a
              href="https://wa.me/5511987835736?text=Quero%20agendar%20mentoria"
              target="_blank"
            >
              <button>Agendar</button>
            </a>
          </div>
        </div>

        <div className="form">
          <input
            type="number"
            placeholder="Valor"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
          />

          <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
            <option value="receita">Receita</option>
            <option value="despesa">Despesa</option>
          </select>

          <button onClick={addTransaction}>Adicionar</button>
        </div>
      </div>
    </div>
  );
}

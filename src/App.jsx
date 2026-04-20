import { useState, useEffect } from "react";
import { supabase } from "./services/supabase";
import DashboardSupport from "./components/DashboardSupport";

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
    const { data } = await supabase.auth.getUser();
    setUser(data.user);
    if (data.user) fetchTransactions(data.user.id);
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
    if (!valor) return;

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

  const receita = transactions
    .filter((t) => t.tipo === "receita")
    .reduce((acc, t) => acc + t.valor, 0);

  const despesa = transactions
    .filter((t) => t.tipo === "despesa")
    .reduce((acc, t) => acc + t.valor, 0);

  const saldo = receita - despesa;
  const progresso = (receita / meta) * 100;

  if (!user) {
    return (
      <div className="login-container">
        <h2>Vertex360</h2>
        <button
          onClick={async () => {
            const email = prompt("Digite seu email");
            const { error } = await supabase.auth.signInWithOtp({ email });
            if (!error) alert("Link enviado para o email");
          }}
        >
          Entrar
        </button>
      </div>
    );
  }

  return (
    <div className="app">

      {/* DASHBOARD SUPPORT (WHATSAPP + AGENDAMENTO) */}
      <DashboardSupport user={user} />

      <div className="cards-grid">
        <div className="card">
          <h3>Receita</h3>
          <h2>R$ {receita}</h2>
        </div>

        <div className="card">
          <h3>Despesa</h3>
          <h2>R$ {despesa}</h2>
        </div>

        <div className="card">
          <h3>Saldo</h3>
          <h2>R$ {saldo}</h2>
        </div>
      </div>

      <div className="meta-card">
        <h3>Meta mensal</h3>
        <input
          value={meta}
          onChange={(e) => setMeta(Number(e.target.value))}
        />
        <div className="progress-bar">
          <div style={{ width: `${progresso}%` }} />
        </div>
        <p>
          R$ {receita} de R$ {meta}
        </p>
      </div>

      <div className="form">
        <input
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

      <div className="historico">
        <h3>Histórico</h3>
        {transactions.map((t, i) => (
          <div key={i} className="item">
            {t.tipo} - R$ {t.valor}
          </div>
        ))}
      </div>
    </div>
  );
}

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
    const { data, error } = await supabase
      .from("movimentacoes")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (!error) {
      setTransactions(data || []);
    }
  }

  async function addTransaction() {
    if (!valor || !user) return;

    const valorNumero = Number(valor);

    if (Number.isNaN(valorNumero) || valorNumero <= 0) {
      alert("Digite um valor válido.");
      return;
    }

    const { error } = await supabase.from("movimentacoes").insert([
      {
        user_id: user.id,
        valor: valorNumero,
        tipo,
      },
    ]);

    if (error) {
      alert("Erro ao adicionar lançamento.");
      return;
    }

    setValor("");
    fetchTransactions(user.id);
  }

  const receita = transactions
    .filter((t) => t.tipo === "receita")
    .reduce((acc, t) => acc + Number(t.valor || 0), 0);

  const despesa = transactions
    .filter((t) => t.tipo === "despesa")
    .reduce((acc, t) => acc + Number(t.valor || 0), 0);

  const saldo = receita - despesa;
  const progresso = meta > 0 ? Math.min((receita / meta) * 100, 100) : 0;

  function formatMoney(value) {
    return Number(value || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  async function handleLogin() {
    const email = prompt("Digite seu email");
    if (!email) return;

    const { error } = await supabase.auth.signInWithOtp({ email });

    if (error) {
      alert("Erro ao enviar link.");
      return;
    }

    alert("Link enviado para o email.");
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
    setTransactions([]);
  }

  // 🔥 LOGIN (NÃO LOGADO)
  if (!user) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
        }}
      >
        <button onClick={handleLogin}>
          Entrar no Vertex360
        </button>
      </div>
    );
  }

  // 🔥 APP (LOGADO)
  return (
    <div className="app">
      <DashboardSupport user={user} />

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

        <p>
          {formatMoney(receita)} de {formatMoney(meta)}
        </p>
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

      <div className="historico">
        <div className="historico-topo">
          <h3>Histórico</h3>
          <button onClick={handleLogout}>Sair</button>
        </div>

        {transactions.length === 0 ? (
          <div className="item">Nenhum lançamento ainda.</div>
        ) : (
          transactions.map((t) => (
            <div key={t.id} className="item">
              <span>
                {t.tipo} -{" "}
                {new Date(t.created_at).toLocaleDateString("pt-BR")}
              </span>
              <strong>{formatMoney(t.valor)}</strong>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

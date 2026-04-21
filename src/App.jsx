import { useEffect, useMemo, useState } from "react";
import { supabase } from "./services/supabase.js";

export default function App() {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState("receita");
  const [meta, setMeta] = useState(3000);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      // limpa token da URL
      if (window.location.hash.includes("access_token")) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      // pega sessão atual corretamente
      const { data } = await supabase.auth.getSession();

      const currentUser = data.session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        await fetchTransactions(currentUser.id);
      }

      setLoading(false);
    }

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        await fetchTransactions(currentUser.id);
      } else {
        setTransactions([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchTransactions(userId) {
    const { data, error } = await supabase
      .from("movimentacoes")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (!error) setTransactions(data || []);
  }

  async function handleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "https://app.vertex360planejamento.com.br",
      },
    });
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
    setTransactions([]);
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

  const receita = useMemo(() => {
    return transactions
      .filter((t) => t.tipo === "receita")
      .reduce((acc, t) => acc + Number(t.valor), 0);
  }, [transactions]);

  const despesa = useMemo(() => {
    return transactions
      .filter((t) => t.tipo === "despesa")
      .reduce((acc, t) => acc + Number(t.valor), 0);
  }, [transactions]);

  const saldo = receita - despesa;

  if (loading) return <div>Carregando...</div>;

  if (!user) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h1>Vertex360</h1>
        <button onClick={handleLogin}>
          Entrar com Google
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Bem-vindo, {user.email}</h2>

      <button onClick={handleLogout}>Sair</button>

      <h3>Saldo: R$ {saldo}</h3>

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

      <ul>
        {transactions.map((t) => (
          <li key={t.id}>
            {t.tipo} - R$ {t.valor}
          </li>
        ))}
      </ul>
    </div>
  );
}

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://pnurseudpiyyosulmwrf.supabase.co",
  "sb_publishable_YaOLy2InC7wJuVNjqvg8Lw_3pRLwnAY"
);

export default function App() {
  const [user, setUser] = useState(null);
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState("receita");
  const [dados, setDados] = useState([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const usuario = data.session?.user;
      setUser(usuario);
      if (usuario) carregarDados(usuario.id);
    });
  }, []);

  async function carregarDados(userId) {
    const { data } = await supabase
      .from("movimentacoes")
      .select("*")
      .eq("user_id", userId);

    setDados(data || []);
  }

  async function adicionar() {
    if (!valor) return;

    await supabase.from("movimentacoes").insert([
      {
        user_id: user.id,
        tipo,
        valor: parseFloat(valor),
      },
    ]);

    setValor("");
    carregarDados(user.id);
  }

  const receita = dados
    .filter((d) => d.tipo === "receita")
    .reduce((acc, d) => acc + d.valor, 0);

  const despesa = dados
    .filter((d) => d.tipo === "despesa")
    .reduce((acc, d) => acc + d.valor, 0);

  const saldo = receita - despesa;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Vertex360</h1>

      {user && <p style={styles.user}>{user.email}</p>}

      <div style={styles.cards}>
        <div style={styles.card}>
          <h3>Receita</h3>
          <p>R$ {receita.toFixed(2)}</p>
        </div>

        <div style={styles.card}>
          <h3>Despesa</h3>
          <p>R$ {despesa.toFixed(2)}</p>
        </div>

        <div style={styles.card}>
          <h3>Saldo</h3>
          <p>R$ {saldo.toFixed(2)}</p>
        </div>
      </div>

      <div style={styles.form}>
        <input
          style={styles.input}
          type="number"
          placeholder="Digite o valor"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
        />

        <select
          style={styles.select}
          onChange={(e) => setTipo(e.target.value)}
        >
          <option value="receita">Receita</option>
          <option value="despesa">Despesa</option>
        </select>

        <button style={styles.button} onClick={adicionar}>
          Adicionar
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: "linear-gradient(135deg, #0b3d91, #1e90ff)",
    color: "#fff",
    height: "100vh",
    textAlign: "center",
    paddingTop: "50px",
  },
  title: {
    fontSize: "32px",
    marginBottom: "10px",
  },
  user: {
    opacity: 0.8,
  },
  cards: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginTop: "30px",
  },
  card: {
    background: "rgba(255,255,255,0.15)",
    padding: "20px",
    borderRadius: "12px",
    minWidth: "120px",
  },
  form: {
    marginTop: "40px",
  },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    marginRight: "10px",
  },
  select: {
    padding: "10px",
    borderRadius: "8px",
    marginRight: "10px",
  },
  button: {
    padding: "10px 20px",
    borderRadius: "8px",
    border: "none",
    background: "#fff",
    color: "#0b3d91",
    fontWeight: "bold",
    cursor: "pointer",
  },
};

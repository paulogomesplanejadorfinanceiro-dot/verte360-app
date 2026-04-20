import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// 🔗 conexão Supabase
const supabase = createClient(
  "https://pnurseudpiyyosulmwrf.supabase.co",
  "sb_publishable_YaOLy2InC7wJuVNjqvg8Lw_3pRLwnAY"
);

export default function App() {
  const [user, setUser] = useState(null);
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState("receita");
  const [receita, setReceita] = useState(0);
  const [despesa, setDespesa] = useState(0);

  // 🔐 sessão
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
    });
  }, []);

  // 📊 carregar dados
  async function carregarDados() {
    if (!user) return;

    const { data, error } = await supabase
      .from("movimentacoes")
      .select("*")
      .eq("user_id", user.id);

    if (error) {
      console.log(error);
      return;
    }

    let totalReceita = 0;
    let totalDespesa = 0;

    data.forEach((item) => {
      if (item.tipo === "receita") {
        totalReceita += Number(item.valor);
      } else {
        totalDespesa += Number(item.valor);
      }
    });

    setReceita(totalReceita);
    setDespesa(totalDespesa);
  }

  useEffect(() => {
    carregarDados();
  }, [user]);

  // ➕ adicionar
  async function adicionar() {
    if (!valor) return;

    const { error } = await supabase.from("movimentacoes").insert([
      {
        user_id: user.id,
        tipo: tipo,
        valor: Number(valor),
      },
    ]);

    if (error) {
      alert("Erro ao salvar");
      console.log(error);
      return;
    }

    setValor("");
    carregarDados();
  }

  const saldo = receita - despesa;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Vertex360</h1>
        <p>{user?.email}</p>
      </div>

      <div style={styles.cards}>
        <div style={styles.card}>
          <h3>Receita</h3>
          <p>R$ {receita.toFixed(2)}</p>
        </div>

        <div style={styles.card}>
          <h3>Despesa</h3>
          <p>R$ {despesa.toFixed(2)}</p>
        </div>

        <div style={styles.cardHighlight}>
          <h3>Saldo</h3>
          <p>R$ {saldo.toFixed(2)}</p>
        </div>
      </div>

      <div style={styles.form}>
        <input
          style={styles.input}
          placeholder="Digite o valor"
          type="number"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
        />

        <select
          style={styles.select}
          value={tipo}
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

// 🎨 DESIGN PROFISSIONAL
const styles = {
  container: {
    minHeight: "100vh",
    padding: "40px 20px",
    fontFamily: "Arial, sans-serif",
    color: "#fff",
    background: "linear-gradient(135deg, #00f2fe, #4facfe)",
    textAlign: "center",
  },

  header: {
    marginBottom: "30px",
  },

  cards: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    flexWrap: "wrap",
    marginBottom: "30px",
  },

  card: {
    background: "rgba(255,255,255,0.15)",
    padding: "25px",
    borderRadius: "15px",
    width: "140px",
    backdropFilter: "blur(10px)",
    boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
  },

  cardHighlight: {
    background: "rgba(255,255,255,0.25)",
    padding: "25px",
    borderRadius: "15px",
    width: "140px",
    backdropFilter: "blur(10px)",
    boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
  },

  form: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    flexWrap: "wrap",
  },

  input: {
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    width: "150px",
  },

  select: {
    padding: "12px",
    borderRadius: "10px",
    border: "none",
  },

  button: {
    padding: "12px 20px",
    borderRadius: "10px",
    border: "none",
    background: "#ffffff",
    color: "#0072ff",
    fontWeight: "bold",
    cursor: "pointer",
  },
};

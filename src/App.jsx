import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// 🔗 SUA CONEXÃO
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

  // 🔐 pega usuário logado
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
    });
  }, []);

  // 📊 buscar dados do banco
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

  // 🔁 sempre que usuário carregar
  useEffect(() => {
    carregarDados();
  }, [user]);

  // ➕ adicionar valor
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
      console.log(error);
      alert("Erro ao salvar!");
      return;
    }

    setValor("");
    carregarDados();
  }

  const saldo = receita - despesa;

  return (
    <div style={styles.container}>
      <h1>Vertex360</h1>
      <p>{user?.email}</p>

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
          placeholder="Digite o valor"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
        />

        <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="receita">Receita</option>
          <option value="despesa">Despesa</option>
        </select>

        <button onClick={adicionar}>Adicionar</button>
      </div>
    </div>
  );
}

// 🎨 estilo simples (depois melhoramos)
const styles = {
  container: {
    textAlign: "center",
    padding: "40px",
    background: "linear-gradient(to right, #1e3c72, #2a5298)",
    minHeight: "100vh",
    color: "#fff",
  },
  cards: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    margin: "30px 0",
  },
  card: {
    background: "#ffffff22",
    padding: "20px",
    borderRadius: "10px",
    width: "120px",
  },
  form: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
  },
};

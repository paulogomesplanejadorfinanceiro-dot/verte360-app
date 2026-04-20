import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://pnurseudpiyyosulmwrf.supabase.co",
  "sb_publishable_YaOLy2InC7wJuVNjqvg8Lw_3pRLwnAY"
);

const isMobile = window.innerWidth < 900;

export default function App() {
  const [user, setUser] = useState(null);
  const [dados, setDados] = useState([]);
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState("receita");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setUser(data.session.user);
        carregar(data.session.user.id);
      }
    });
  }, []);

  async function carregar(id) {
    const { data } = await supabase
      .from("movimentacoes")
      .select("*")
      .eq("user_id", id);

    setDados(data || []);
  }

  async function adicionar() {
    if (!valor) return;

    await supabase.from("movimentacoes").insert([
      {
        user_id: user.id,
        tipo,
        valor: Number(valor),
      },
    ]);

    setValor("");
    carregar(user.id);
  }

  const receita = dados
    .filter((i) => i.tipo === "receita")
    .reduce((a, b) => a + b.valor, 0);

  const despesa = dados
    .filter((i) => i.tipo === "despesa")
    .reduce((a, b) => a + b.valor, 0);

  const saldo = receita - despesa;

  if (!user) {
    return <div style={styles.center}>Faça login primeiro</div>;
  }

  return (
    <div style={styles.app}>
      {/* SIDEBAR (desktop) */}
      {!isMobile && (
        <div style={styles.sidebar}>
          <h2>Vertex360</h2>
        </div>
      )}

      <div style={styles.main}>
        {/* CARDS */}
        <div style={styles.cards}>
          <Card title="Receita" value={receita} />
          <Card title="Despesa" value={despesa} />
          <Card title="Saldo" value={saldo} />
        </div>

        {/* INPUT */}
        <div style={styles.form}>
          <input
            style={styles.input}
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            placeholder="Valor"
          />

          <select
            style={styles.input}
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

        {/* HISTÓRICO */}
        <div style={styles.lista}>
          {dados.map((i) => (
            <div key={i.id} style={styles.item}>
              {i.tipo} - R$ {i.valor}
            </div>
          ))}
        </div>
      </div>

      {/* BOTÃO FLUTUANTE */}
      <button style={styles.fab}>+</button>

      {/* MENU MOBILE */}
      {isMobile && (
        <div style={styles.bottomNav}>
          <div>🏠</div>
          <div>📊</div>
          <div>🎯</div>
          <div>⚙️</div>
        </div>
      )}
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div style={styles.card}>
      <h4>{title}</h4>
      <h2>R$ {value}</h2>
    </div>
  );
}

const styles = {
  app: {
    display: "flex",
    background: "linear-gradient(180deg,#0f2d7a,#050c1f)",
    minHeight: "100vh",
    color: "#fff",
    overflowX: "hidden",
  },

  sidebar: {
    width: 250,
    padding: 20,
    background: "#0b1f5a",
  },

  main: {
    flex: 1,
    padding: 20,
    paddingBottom: 100,
  },

  cards: {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 1fr",
    gap: 10,
  },

  card: {
    background: "rgba(255,255,255,0.1)",
    padding: 15,
    borderRadius: 15,
  },

  form: {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr",
    gap: 10,
    marginTop: 20,
  },

  input: {
    padding: 12,
    borderRadius: 10,
    border: "none",
  },

  button: {
    background: "#00d4ff",
    border: "none",
    padding: 12,
    borderRadius: 10,
  },

  lista: {
    marginTop: 20,
  },

  item: {
    padding: 10,
    borderBottom: "1px solid rgba(255,255,255,0.1)",
  },

  fab: {
    position: "fixed",
    bottom: 80,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: "50%",
    background: "#00d4ff",
    color: "#000",
    fontSize: 30,
    border: "none",
  },

  bottomNav: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    background: "#0b1f5a",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
  },

  center: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
  },
};

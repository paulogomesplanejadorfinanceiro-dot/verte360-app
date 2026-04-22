import { useState } from "react";

export default function Lancamentos() {
  const [tipo, setTipo] = useState("receita");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");

  const [lancamentos, setLancamentos] = useState([]);

  function adicionarLancamento() {
    if (!descricao || !valor) return;

    const novo = {
      id: Date.now(),
      tipo,
      descricao,
      valor: parseFloat(valor),
    };

    setLancamentos([novo, ...lancamentos]);

    setDescricao("");
    setValor("");
  }

  function remover(id) {
    setLancamentos(lancamentos.filter((l) => l.id !== id));
  }

  const receitas = lancamentos
    .filter((l) => l.tipo === "receita")
    .reduce((acc, l) => acc + l.valor, 0);

  const despesas = lancamentos
    .filter((l) => l.tipo === "despesa")
    .reduce((acc, l) => acc + l.valor, 0);

  const saldo = receitas - despesas;

  return (
    <div style={styles.container}>
      <h1>Lançamentos</h1>

      {/* RESUMO */}
      <div style={styles.resumo}>
        <Card title="Receitas" valor={receitas} cor="#22c55e" />
        <Card title="Despesas" valor={despesas} cor="#ef4444" />
        <Card title="Saldo" valor={saldo} cor="#3b82f6" />
      </div>

      {/* FORMULÁRIO */}
      <div style={styles.form}>
        <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="receita">Receita</option>
          <option value="despesa">Despesa</option>
        </select>

        <input
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />

        <input
          placeholder="Valor"
          type="number"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
        />

        <button onClick={adicionarLancamento}>
          Adicionar
        </button>
      </div>

      {/* LISTA */}
      <div style={styles.lista}>
        {lancamentos.map((l) => (
          <div key={l.id} style={styles.item}>
            <div>
              <strong>{l.descricao}</strong>
              <p>{l.tipo}</p>
            </div>

            <div>
              <strong style={{ color: l.tipo === "receita" ? "#22c55e" : "#ef4444" }}>
                R$ {l.valor.toFixed(2)}
              </strong>
            </div>

            <button onClick={() => remover(l.id)}>X</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Card({ title, valor, cor }) {
  return (
    <div style={{ ...styles.card, borderLeft: `4px solid ${cor}` }}>
      <h3>{title}</h3>
      <h2>R$ {valor.toFixed(2)}</h2>
    </div>
  );
}

const styles = {
  container: {
    padding: "30px",
  },

  resumo: {
    display: "flex",
    gap: "15px",
    marginBottom: "20px",
  },

  card: {
    background: "#0f2345",
    padding: "20px",
    borderRadius: "10px",
    minWidth: "180px",
  },

  form: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },

  lista: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  item: {
    display: "flex",
    justifyContent: "space-between",
    background: "#0f2345",
    padding: "15px",
    borderRadius: "10px",
    alignItems: "center",
  },
};

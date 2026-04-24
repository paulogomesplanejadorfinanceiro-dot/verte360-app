import { useState } from "react";

export default function Planejamento() {
  const [idadeAtual, setIdadeAtual] = useState(25);
  const [idadeAposentadoria, setIdadeAposentadoria] = useState(60);
  const [aporteMensal, setAporteMensal] = useState(500);
  const [resultado, setResultado] = useState(0);

  function calcular() {
    let patrimonio = 0;
    const taxa = 0.01; // 1% ao mês

    const anos = idadeAposentadoria - idadeAtual;

    for (let i = 0; i < anos; i++) {
      patrimonio = patrimonio * (1 + taxa) + aporteMensal * 12;
    }

    setResultado(patrimonio);
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.titulo}>Planejamento Financeiro</h2>

      <div style={styles.card}>
        <label>Idade Atual</label>
        <input
          type="number"
          value={idadeAtual}
          onChange={(e) => setIdadeAtual(Number(e.target.value))}
          style={styles.input}
        />

        <label>Idade Aposentadoria</label>
        <input
          type="number"
          value={idadeAposentadoria}
          onChange={(e) => setIdadeAposentadoria(Number(e.target.value))}
          style={styles.input}
        />

        <label>Aporte Mensal (R$)</label>
        <input
          type="number"
          value={aporteMensal}
          onChange={(e) => setAporteMensal(Number(e.target.value))}
          style={styles.input}
        />

        <button style={styles.botao} onClick={calcular}>
          Calcular
        </button>
      </div>

      <div style={styles.resultado}>
        <h3>Resultado</h3>
        <p style={styles.valor}>
          R$ {resultado.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: 20,
    color: "#fff"
  },
  titulo: {
    marginBottom: 20
  },
  card: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    background: "#1e293b",
    padding: 20,
    borderRadius: 10,
    maxWidth: 400
  },
  input: {
    padding: 10,
    borderRadius: 5,
    border: "none"
  },
  botao: {
    marginTop: 10,
    padding: 10,
    background: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: 5,
    cursor: "pointer"
  },
  resultado: {
    marginTop: 30,
    background: "#1e293b",
    padding: 20,
    borderRadius: 10,
    maxWidth: 400
  },
  valor: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#22c55e"
  }
};

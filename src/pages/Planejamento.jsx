import { useMemo, useState } from "react";

export default function Planejamento() {
  const [renda, setRenda] = useState("");
  const [percentualGastos, setPercentualGastos] = useState(50);
  const [percentualInvestimentos, setPercentualInvestimentos] = useState(30);
  const [percentualLazer, setPercentualLazer] = useState(20);

  const calculo = useMemo(() => {
    const rendaNumero = Number(renda || 0);

    const gastos = (rendaNumero * percentualGastos) / 100;
    const investimentos = (rendaNumero * percentualInvestimentos) / 100;
    const lazer = (rendaNumero * percentualLazer) / 100;

    return {
      gastos,
      investimentos,
      lazer,
    };
  }, [renda, percentualGastos, percentualInvestimentos, percentualLazer]);

  function moeda(valor) {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Planejamento</h1>
      <p style={styles.subtitle}>
        Defina como seu dinheiro será distribuído.
      </p>

      <div style={styles.card}>
        <label style={styles.label}>Renda mensal</label>
        <input
          style={styles.input}
          type="number"
          placeholder="Ex: 3000"
          value={renda}
          onChange={(e) => setRenda(e.target.value)}
        />
      </div>

      <div style={styles.card}>
        <h2>Distribuição (%)</h2>

        <div style={styles.row}>
          <span>Gastos</span>
          <input
            type="number"
            value={percentualGastos}
            onChange={(e) => setPercentualGastos(Number(e.target.value))}
            style={styles.inputSmall}
          />
        </div>

        <div style={styles.row}>
          <span>Investimentos</span>
          <input
            type="number"
            value={percentualInvestimentos}
            onChange={(e) => setPercentualInvestimentos(Number(e.target.value))}
            style={styles.inputSmall}
          />
        </div>

        <div style={styles.row}>
          <span>Lazer</span>
          <input
            type="number"
            value={percentualLazer}
            onChange={(e) => setPercentualLazer(Number(e.target.value))}
            style={styles.inputSmall}
          />
        </div>
      </div>

      <div style={styles.card}>
        <h2>Resultado</h2>

        <div style={styles.result}>
          <strong>Gastos:</strong> {moeda(calculo.gastos)}
        </div>

        <div style={styles.result}>
          <strong>Investimentos:</strong> {moeda(calculo.investimentos)}
        </div>

        <div style={styles.result}>
          <strong>Lazer:</strong> {moeda(calculo.lazer)}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "30px",
    background: "#07152d",
    minHeight: "100vh",
    color: "#fff",
  },

  title: {
    fontSize: "40px",
    marginBottom: "5px",
  },

  subtitle: {
    marginBottom: "20px",
    color: "#a0b3d6",
  },

  card: {
    background: "#0b1d38",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "20px",
  },

  label: {
    display: "block",
    marginBottom: "5px",
  },

  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    marginTop: "5px",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "10px",
  },

  inputSmall: {
    width: "80px",
    padding: "5px",
    borderRadius: "6px",
    border: "none",
  },

  result: {
    marginTop: "10px",
    fontSize: "18px",
  },
};

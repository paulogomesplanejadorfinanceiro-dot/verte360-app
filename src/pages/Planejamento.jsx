import { useState, useEffect } from "react";

// 🔥 IMPORTAÇÃO SEGURA (não quebra build)
let Recharts;
try {
  Recharts = require("recharts");
} catch (e) {
  Recharts = null;
}

export default function Planejamento() {
  const [idadeAtual, setIdadeAtual] = useState(25);
  const [idadeAposentadoria, setIdadeAposentadoria] = useState(45);
  const [aporte, setAporte] = useState(500);
  const [rendaDesejada, setRendaDesejada] = useState(3000);
  const [patrimonio, setPatrimonio] = useState(0);

  const [dadosGrafico, setDadosGrafico] = useState([]);
  const [alerta, setAlerta] = useState("");

  // 🔥 PUXAR INVESTIMENTOS (automático)
  useEffect(() => {
    try {
      const investimentos =
        JSON.parse(localStorage.getItem("investimentos")) || [];
      const total = investimentos.reduce(
        (acc, inv) => acc + Number(inv.valor || 0),
        0
      );
      setPatrimonio(total);
    } catch {
      setPatrimonio(0);
    }
  }, []);

  // 🔥 RECALCULAR SEMPRE
  useEffect(() => {
    calcular();
  }, [idadeAtual, idadeAposentadoria, aporte, rendaDesejada, patrimonio]);

  function calcular() {
    const taxa = 0.01;
    const inflacao = 0.005;

    let dados = [];

    let p1 = Number(patrimonio);
    let p2 = Number(patrimonio);
    let p3 = Number(patrimonio);

    let idadeFalencia = null;

    for (let idade = Number(idadeAtual); idade <= 100; idade++) {
      // 🔴 Consumindo patrimônio
      p1 = p1 * (1 + taxa) - rendaDesejada * 12;
      if (p1 <= 0 && !idadeFalencia) {
        idadeFalencia = idade;
      }

      // 🔵 Preservando
      p2 = p2 * (1 + taxa);

      // 🟢 Crescimento real
      p3 = p3 * (1 + (taxa - inflacao));

      dados.push({
        idade,
        consumir: p1 > 0 ? p1 : 0,
        preservar: p2,
        crescer: p3,
      });
    }

    setDadosGrafico(dados);

    if (idadeFalencia) {
      setAlerta(
        `⚠️ Se continuar assim, seu dinheiro acaba aos ${idadeFalencia} anos`
      );
    } else {
      setAlerta("✅ Seu patrimônio é sustentável no longo prazo");
    }
  }

  // 🔥 FORMATAÇÃO BONITA
  function formatar(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  return (
    <div style={styles.container}>
      <h2>Planejamento de Aposentadoria</h2>

      {/* INPUTS */}
      <div style={styles.grid}>
        <input
          style={styles.input}
          type="number"
          placeholder="Idade atual"
          value={idadeAtual}
          onChange={(e) => setIdadeAtual(e.target.value)}
        />

        <input
          style={styles.input}
          type="number"
          placeholder="Idade aposentadoria"
          value={idadeAposentadoria}
          onChange={(e) => setIdadeAposentadoria(e.target.value)}
        />

        <input
          style={styles.input}
          type="number"
          placeholder="Aporte mensal"
          value={aporte}
          onChange={(e) => setAporte(e.target.value)}
        />

        <input
          style={styles.input}
          type="number"
          placeholder="Renda desejada"
          value={rendaDesejada}
          onChange={(e) => setRendaDesejada(e.target.value)}
        />
      </div>

      {/* ALERTA */}
      <div style={styles.alerta}>{alerta}</div>

      {/* GRÁFICO */}
      <div style={{ marginTop: 20 }}>
        {Recharts ? (
          <Recharts.LineChart width={350} height={250} data={dadosGrafico}>
            <Recharts.XAxis dataKey="idade" />
            <Recharts.YAxis />
            <Recharts.Tooltip />
            <Recharts.Legend />

            <Recharts.Line
              dataKey="consumir"
              stroke="#ef4444"
              name="Consumindo"
            />
            <Recharts.Line
              dataKey="preservar"
              stroke="#3b82f6"
              name="Preservando"
            />
            <Recharts.Line
              dataKey="crescer"
              stroke="#22c55e"
              name="Crescendo"
            />
          </Recharts.LineChart>
        ) : (
          <p style={{ marginTop: 20 }}>
            ⚠️ Gráfico não carregado. Instale: npm install recharts
          </p>
        )}
      </div>

      {/* EXPLICAÇÃO */}
      <div style={{ marginTop: 20 }}>
        <p>🔴 Consumindo → patrimônio acaba</p>
        <p>🔵 Preservando → mantém valor</p>
        <p>🟢 Crescendo → aumenta riqueza</p>
      </div>
    </div>
  );
}

// 🎨 ESTILO
const styles = {
  container: {
    padding: 20,
  },
  grid: {
    display: "grid",
    gap: 10,
  },
  input: {
    padding: 10,
    borderRadius: 8,
    border: "1px solid #ccc",
  },
  alerta: {
    marginTop: 20,
    background: "#1e293b",
    color: "#fff",
    padding: 10,
    borderRadius: 10,
  },
};

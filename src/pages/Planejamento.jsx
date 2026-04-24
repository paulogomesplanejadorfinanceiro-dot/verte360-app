import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Planejamento() {
  const [idadeAtual, setIdadeAtual] = useState(25);
  const [idadeAposentadoria, setIdadeAposentadoria] = useState(50);
  const [aporte, setAporte] = useState(500);
  const [rendaDesejada, setRendaDesejada] = useState(3000);
  const [patrimonio, setPatrimonio] = useState(0);

  const [dadosGrafico, setDadosGrafico] = useState([]);
  const [alerta, setAlerta] = useState("");
  const [resumo, setResumo] = useState(null);

  // 🔥 PUXA INVESTIMENTOS AUTOMÁTICO
  useEffect(() => {
    const investimentos =
      JSON.parse(localStorage.getItem("investimentos")) || [];

    const total = investimentos.reduce(
      (acc, inv) => acc + Number(inv.valor || 0),
      0
    );

    setPatrimonio(total);
  }, []);

  // 🔥 RECALCULA SEMPRE
  useEffect(() => {
    calcular();
  }, [idadeAtual, idadeAposentadoria, aporte, rendaDesejada, patrimonio]);

  function calcular() {
    const taxa = 0.01; // 1% ao mês
    const inflacao = 0.005;

    const anos = idadeAposentadoria - idadeAtual;
    const meses = anos * 12;

    let montante = patrimonio;

    for (let i = 0; i < meses; i++) {
      montante = montante * (1 + taxa) + Number(aporte);
    }

    const patrimonioNecessario = rendaDesejada / 0.005;

    setResumo({
      montante,
      patrimonioNecessario,
      falta: patrimonioNecessario - montante,
    });

    // 🔥 GRÁFICO + ALERTA
    let dados = [];

    let p1 = patrimonio;
    let p2 = patrimonio;
    let p3 = patrimonio;

    let idadeFalencia = null;

    for (let idade = idadeAtual; idade <= 100; idade++) {
      // 🔴 Consumindo
      p1 = p1 * (1 + taxa) - rendaDesejada * 12;
      if (p1 <= 0 && !idadeFalencia) {
        idadeFalencia = idade;
      }

      // 🔵 Preservando
      p2 = p2 * (1 + taxa);

      // 🟢 Crescendo acima inflação
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
      setAlerta("✅ Seu patrimônio está sustentável no longo prazo");
    }
  }

  function formatar(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  return (
    <div style={styles.container}>
      <h2>Planejamento de Aposentadoria</h2>

      <p style={styles.subtitulo}>
        Simule seu futuro financeiro e descubra se você está no caminho certo.
      </p>

      {/* INPUTS */}
      <div style={styles.grid}>
        <div>
          <label style={styles.label}>Idade atual</label>
          <input
            style={styles.input}
            type="number"
            value={idadeAtual}
            onChange={(e) => setIdadeAtual(Number(e.target.value))}
          />
        </div>

        <div>
          <label style={styles.label}>Idade que quer se aposentar</label>
          <input
            style={styles.input}
            type="number"
            value={idadeAposentadoria}
            onChange={(e) => setIdadeAposentadoria(Number(e.target.value))}
          />
        </div>

        <div>
          <label style={styles.label}>Aporte mensal</label>
          <input
            style={styles.input}
            type="number"
            value={aporte}
            onChange={(e) => setAporte(Number(e.target.value))}
          />
        </div>

        <div>
          <label style={styles.label}>
            Quanto quer receber por mês na aposentadoria
          </label>
          <input
            style={styles.input}
            type="number"
            value={rendaDesejada}
            onChange={(e) => setRendaDesejada(Number(e.target.value))}
          />
        </div>
      </div>

      {/* ALERTA */}
      <div style={styles.alerta}>{alerta}</div>

      {/* RESULTADO */}
      {resumo && (
        <div style={styles.card}>
          <p>Patrimônio projetado: {formatar(resumo.montante)}</p>
          <p>Necessário para viver: {formatar(resumo.patrimonioNecessario)}</p>
          <p>Falta: {formatar(resumo.falta)}</p>
        </div>
      )}

      {/* GRÁFICO */}
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={dadosGrafico}>
            <XAxis dataKey="idade" />
            <YAxis />
            <Tooltip />
            <Legend />

            <Line
              type="monotone"
              dataKey="consumir"
              stroke="#ef4444"
              name="Consumindo patrimônio"
            />
            <Line
              type="monotone"
              dataKey="preservar"
              stroke="#3b82f6"
              name="Preservando"
            />
            <Line
              type="monotone"
              dataKey="crescer"
              stroke="#22c55e"
              name="Crescendo"
            />
          </LineChart>
        </ResponsiveContainer>
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
  subtitulo: {
    color: "#aaa",
    marginBottom: 15,
  },
  grid: {
    display: "grid",
    gap: 10,
  },
  label: {
    color: "#ccc",
    fontWeight: "bold",
    marginBottom: 5,
    display: "block",
  },
  input: {
    width: "100%",
    padding: 10,
    borderRadius: 8,
    border: "1px solid #333",
    background: "#0f172a",
    color: "#fff",
  },
  alerta: {
    marginTop: 20,
    background: "#1e293b",
    padding: 12,
    borderRadius: 10,
    color: "#fff",
  },
  card: {
    marginTop: 15,
    background: "#0f172a",
    padding: 15,
    borderRadius: 10,
  },
};

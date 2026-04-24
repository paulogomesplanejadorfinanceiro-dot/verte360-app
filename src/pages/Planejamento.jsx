import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

export default function Planejamento() {

  const [idadeAtual, setIdadeAtual] = useState(25);
  const [idadeAposentadoria, setIdadeAposentadoria] = useState(45);
  const [aporte, setAporte] = useState(500);
  const [rendaDesejada, setRendaDesejada] = useState(3000);
  const [patrimonio, setPatrimonio] = useState(10000);

  const [dadosGrafico, setDadosGrafico] = useState([]);
  const [alerta, setAlerta] = useState("");

  useEffect(() => {
    calcularTudo();
  }, [idadeAtual, idadeAposentadoria, aporte, rendaDesejada, patrimonio]);

  function calcularTudo() {

    const taxa = 0.01;
    const inflacao = 0.005;

    let dados = [];

    let p1 = Number(patrimonio);
    let p2 = Number(patrimonio);
    let p3 = Number(patrimonio);

    let idadeFalencia = null;

    for (let idade = Number(idadeAtual); idade <= 100; idade++) {

      // 🔴 Cenário 1: consumindo
      p1 = p1 * (1 + taxa) - rendaDesejada * 12;
      if (p1 <= 0 && !idadeFalencia) {
        idadeFalencia = idade;
      }

      // 🔵 Cenário 2: preservando
      p2 = p2 * (1 + taxa);

      // 🟢 Cenário 3: crescimento real
      p3 = p3 * (1 + (taxa - inflacao));

      dados.push({
        idade,
        consumir: p1 > 0 ? p1 : 0,
        preservar: p2,
        crescer: p3
      });
    }

    setDadosGrafico(dados);

    // 🔥 ALERTA INTELIGENTE
    if (idadeFalencia) {
      setAlerta(`⚠️ Se continuar assim, seu dinheiro acaba aos ${idadeFalencia} anos`);
    } else {
      setAlerta("✅ Seu patrimônio não acaba");
    }
  }

  return (
    <div style={{ padding: 20 }}>

      <h2>Planejamento de Aposentadoria</h2>

      {/* INPUTS */}
      <div style={{ display: "grid", gap: 10, marginBottom: 20 }}>

        <input
          type="number"
          placeholder="Idade atual"
          value={idadeAtual}
          onChange={(e) => setIdadeAtual(e.target.value)}
        />

        <input
          type="number"
          placeholder="Idade aposentadoria"
          value={idadeAposentadoria}
          onChange={(e) => setIdadeAposentadoria(e.target.value)}
        />

        <input
          type="number"
          placeholder="Patrimônio atual"
          value={patrimonio}
          onChange={(e) => setPatrimonio(e.target.value)}
        />

        <input
          type="number"
          placeholder="Aporte mensal"
          value={aporte}
          onChange={(e) => setAporte(e.target.value)}
        />

        <input
          type="number"
          placeholder="Renda desejada"
          value={rendaDesejada}
          onChange={(e) => setRendaDesejada(e.target.value)}
        />

      </div>

      {/* ALERTA */}
      <div style={{
        background: "#1e293b",
        padding: 10,
        borderRadius: 10,
        marginBottom: 20
      }}>
        <strong>{alerta}</strong>
      </div>

      {/* GRÁFICO */}
      <div style={{ width: "100%", height: 300 }}>

        <ResponsiveContainer>
          <LineChart data={dadosGrafico}>
            <XAxis dataKey="idade" />
            <YAxis />
            <Tooltip />
            <Legend />

            <Line type="monotone" dataKey="consumir" stroke="#ef4444" name="Consumindo patrimônio" />
            <Line type="monotone" dataKey="preservar" stroke="#3b82f6" name="Preservando" />
            <Line type="monotone" dataKey="crescer" stroke="#22c55e" name="Crescendo" />

          </LineChart>
        </ResponsiveContainer>

      </div>

      {/* EXPLICAÇÃO */}
      <div style={{ marginTop: 20 }}>

        <p>🔴 Consumindo: você gasta tudo → patrimônio acaba</p>
        <p>🔵 Preservando: mantém o valor</p>
        <p>🟢 Crescendo: aumenta riqueza</p>

      </div>

    </div>
  );
}

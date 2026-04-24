import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Planejamento() {
  const [idadeAtual, setIdadeAtual] = useState(25);
  const [idadeAposentadoria, setIdadeAposentadoria] = useState(60);
  const [aporteMensal, setAporteMensal] = useState(500);
  const [taxa, setTaxa] = useState(0.01); // 1% ao mês

  function calcular() {
    let dados = [];
    let patrimonio = 0;

    for (let i = idadeAtual; i <= idadeAposentadoria; i++) {
      patrimonio = patrimonio * (1 + taxa) + aporteMensal * 12;

      dados.push({
        idade: i,
        patrimonio: Math.round(patrimonio),
      });
    }

    return dados;
  }

  const dados = calcular();

  return (
    <div style={{ padding: 20 }}>
      <h2>Planejamento Financeiro</h2>

      <div style={{ marginBottom: 20 }}>
        <input
          type="number"
          value={idadeAtual}
          onChange={(e) => setIdadeAtual(Number(e.target.value))}
          placeholder="Idade atual"
        />

        <input
          type="number"
          value={idadeAposentadoria}
          onChange={(e) => setIdadeAposentadoria(Number(e.target.value))}
          placeholder="Idade aposentadoria"
        />

        <input
          type="number"
          value={aporteMensal}
          onChange={(e) => setAporteMensal(Number(e.target.value))}
          placeholder="Aporte mensal"
        />
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={dados}>
          <XAxis dataKey="idade" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="patrimonio" stroke="#00ff88" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

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
    <div style={{ padding: 20 }}>
      <h2>Planejamento Financeiro</h2>

      <div style={{ marginBottom: 15 }}>
        <label>Idade Atual</label><br />
        <input
          type="number"
          value={idadeAtual}
          onChange={(e) => setIdadeAtual(Number(e.target.value))}
        />
      </div>

      <div style={{ marginBottom: 15 }}>
        <label>Idade de Aposentadoria</label><br />
        <input
          type="number"
          value={idadeAposentadoria}
          onChange={(e) => setIdadeAposentadoria(Number(e.target.value))}
        />
      </div>

      <div style={{ marginBottom: 15 }}>
        <label>Aporte Mensal (R$)</label><br />
        <input
          type="number"
          value={aporteMensal}
          onChange={(e) => setAporteMensal(Number(e.target.value))}
        />
      </div>

      <button onClick={calcular} style={{ marginBottom: 20 }}>
        Calcular
      </button>

      <h3>
        Patrimônio estimado: R$ {resultado.toLocaleString("pt-BR")}
      </h3>
    </div>
  );
}

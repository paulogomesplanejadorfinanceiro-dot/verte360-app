import { useState } from "react";

export default function Planejamento() {
  const [idadeAtual, setIdadeAtual] = useState(25);
  const [idadeAposentadoria, setIdadeAposentadoria] = useState(60);
  const [aporteMensal, setAporteMensal] = useState(500);

  function calcularPatrimonio() {
    let patrimonio = 0;
    const taxa = 0.01; // 1% ao mês

    const anos = idadeAposentadoria - idadeAtual;

    for (let i = 0; i < anos; i++) {
      patrimonio = patrimonio * (1 + taxa) + aporteMensal * 12;
    }

    return patrimonio;
  }

  const resultado = calcularPatrimonio();

  return (
    <div style={{ padding: 20 }}>
      <h2>Planejamento Financeiro</h2>

      <div style={{ marginBottom: 10 }}>
        <label>Idade atual:</label><br />
        <input
          type="number"
          value={idadeAtual}
          onChange={(e) => setIdadeAtual(Number(e.target.value))}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label>Idade de aposentadoria:</label><br />
        <input
          type="number"
          value={idadeAposentadoria}
          onChange={(e) =>
            setIdadeAposentadoria(Number(e.target.value))
          }
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label>Aporte mensal (R$):</label><br />
        <input
          type="number"
          value={aporteMensal}
          onChange={(e) =>
            setAporteMensal(Number(e.target.value))
          }
        />
      </div>

      <h3>
        Patrimônio estimado: R$ {resultado.toLocaleString("pt-BR")}
      </h3>
    </div>
  );
}

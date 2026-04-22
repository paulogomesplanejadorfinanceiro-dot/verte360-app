import { useState } from "react";

export default function Lancamentos({
  lancamentos,
  receitas,
  despesas,
  saldo,
  onAddLancamento,
  onRemoveLancamento,
}) {
  const [tipo, setTipo] = useState("receita");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");

  function adicionar() {
    if (!descricao || !valor) return;

    const novo = {
      id: Date.now(),
      tipo,
      descricao,
      valor: parseFloat(valor),
    };

    onAddLancamento(novo);

    setDescricao("");
    setValor("");
  }

  return (
    <div className="page-content">
      <h1>Lançamentos</h1>

      <section className="dashboard-cards">
        <ResumoCard titulo="Receitas" valor={receitas} cor="#22c55e" />
        <ResumoCard titulo="Despesas" valor={despesas} cor="#ef4444" />
        <ResumoCard titulo="Saldo" valor={saldo} cor="#3b82f6" />
      </section>

      <div className="panel">
        <div className="panel-header">
          <h3>Novo lançamento</h3>
        </div>

        <div className="form-row">
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
            type="number"
            placeholder="Valor"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
          />

          <button onClick={adicionar}>Adicionar</button>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <h3>Histórico</h3>
        </div>

        <div className="list-block">
          {lancamentos.length === 0 ? (
            <div className="empty-state">
              Nenhum lançamento ainda.
            </div>
          ) : (
            lancamentos.map((item) => (
              <div className="list-row" key={item.id}>
                <div>
                  <strong>{item.descricao}</strong>
                  <span>{item.tipo}</span>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <strong
                    style={{
                      color:
                        item.tipo === "receita" ? "#22c55e" : "#ef4444",
                    }}
                  >
                    {item.tipo === "receita" ? "R$ " : "- R$ "}
                    {item.valor.toFixed(2)}
                  </strong>

                  <button
                    onClick={() => onRemoveLancamento(item.id)}
                    style={{
                      background: "#ef4444",
                      border: "none",
                      color: "#fff",
                      padding: "4px 8px",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    X
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function ResumoCard({ titulo, valor, cor }) {
  return (
    <div className="dashboard-card">
      <span>{titulo}</span>
      <h2>R$ {valor.toFixed(2)}</h2>
      <p style={{ color: cor }}>Atualizado automaticamente</p>
    </div>
  );
}

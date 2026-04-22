export default function Dashboard({
  lancamentos = [],
  receitas = 0,
  despesas = 0,
  saldo = 0,
}) {
  const ultimosLancamentos = lancamentos.slice(0, 5);

  const metas = [
    {
      nome: "Viagem para Europa",
      progresso: 75,
      detalhe: "R$ 7.500,00 de R$ 10.000,00",
      cor: "#3b82f6",
    },
    {
      nome: "Reserva de Emergência",
      progresso: 45,
      detalhe: "R$ 4.500,00 de R$ 10.000,00",
      cor: "#8b5cf6",
    },
    {
      nome: "Compra de um carro",
      progresso: 40,
      detalhe: "R$ 20.000,00 de R$ 50.000,00",
      cor: "#22c55e",
    },
  ];

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Bem-vindo(a) de volta ao Vertex360.</p>
        </div>

        <div className="period-box">
          <span>Período</span>
          <select>
            <option>Este mês</option>
            <option>Últimos 3 meses</option>
            <option>Últimos 6 meses</option>
          </select>
        </div>
      </div>

      <section className="dashboard-cards">
        <ResumoCard
          titulo="Receitas"
          valor={receitas}
          detalhe="Total das entradas lançadas"
          cor="#22c55e"
          emoji="↗"
        />

        <ResumoCard
          titulo="Despesas"
          valor={despesas}
          detalhe="Total das saídas lançadas"
          cor="#ef4444"
          emoji="↘"
        />

        <ResumoCard
          titulo="Saldo"
          valor={saldo}
          detalhe={saldo >= 0 ? "Saldo atual positivo" : "Saldo atual negativo"}
          cor={saldo >= 0 ? "#10b981" : "#ef4444"}
          emoji="$"
        />
      </section>

      <section className="dashboard-grid">
        <div className="panel panel-large">
          <div className="panel-header">
            <h3>Resumo financeiro</h3>
            <span className="panel-badge">Atualizado</span>
          </div>

          <div className="fake-chart">
            <div className="chart-line blue"></div>
            <div className="chart-line red"></div>
            <div className="chart-line green"></div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h3>Distribuição de despesas</h3>
          </div>

          <div className="expense-legend">
            <div><span className="dot moradia"></span> Moradia 35%</div>
            <div><span className="dot alimentacao"></span> Alimentação 25%</div>
            <div><span className="dot transporte"></span> Transporte 15%</div>
            <div><span className="dot saude"></span> Saúde 10%</div>
            <div><span className="dot lazer"></span> Lazer 10%</div>
            <div><span className="dot outros"></span> Outros 5%</div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h3>Últimos lançamentos</h3>
          </div>

          <div className="list-block">
            {ultimosLancamentos.length === 0 ? (
              <div className="empty-state">
                Nenhum lançamento adicionado ainda.
              </div>
            ) : (
              ultimosLancamentos.map((item) => (
                <div className="list-row" key={item.id}>
                  <div>
                    <strong>{item.descricao}</strong>
                    <span>{item.tipo}</span>
                  </div>

                  <strong
                    style={{
                      color: item.tipo === "receita" ? "#22c55e" : "#ef4444",
                    }}
                  >
                    {item.tipo === "receita" ? "R$ " : "- R$ "}
                    {item.valor.toFixed(2)}
                  </strong>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h3>Metas em andamento</h3>
          </div>

          <div className="goals-block">
            {metas.map((meta, index) => (
              <div className="goal-item" key={index}>
                <div className="goal-top">
                  <strong>{meta.nome}</strong>
                  <span>{meta.progresso}%</span>
                </div>

                <div className="goal-bar">
                  <div
                    className="goal-fill"
                    style={{
                      width: `${meta.progresso}%`,
                      backgroundColor: meta.cor,
                    }}
                  ></div>
                </div>

                <small>{meta.detalhe}</small>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function ResumoCard({ titulo, valor, detalhe, cor, emoji }) {
  return (
    <div className="dashboard-card">
      <div className="card-top">
        <div
          className="card-icon"
          style={{ backgroundColor: `${cor}22`, color: cor }}
        >
          {emoji}
        </div>
        <span className="card-title">{titulo}</span>
      </div>

      <h2>R$ {valor.toFixed(2)}</h2>
      <p style={{ color: cor }}>{detalhe}</p>
    </div>
  );
}

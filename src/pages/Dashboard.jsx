export default function Dashboard() {
  const cards = [
    {
      titulo: "Receitas",
      valor: "R$ 8.250,00",
      detalhe: "+12,5% vs mês anterior",
      cor: "#22c55e",
      emoji: "↗",
    },
    {
      titulo: "Despesas",
      valor: "R$ 4.230,00",
      detalhe: "-8,7% vs mês anterior",
      cor: "#ef4444",
      emoji: "↘",
    },
    {
      titulo: "Saldo",
      valor: "R$ 4.020,00",
      detalhe: "+18,7% vs mês anterior",
      cor: "#10b981",
      emoji: "$",
    },
  ];

  const lancamentos = [
    { nome: "Salário", tipo: "Receita", valor: "R$ 5.000,00", cor: "#22c55e" },
    { nome: "Mercado", tipo: "Despesa", valor: "- R$ 350,00", cor: "#ef4444" },
    { nome: "Freelance", tipo: "Receita", valor: "R$ 1.200,00", cor: "#22c55e" },
    { nome: "Aluguel", tipo: "Despesa", valor: "- R$ 1.200,00", cor: "#ef4444" },
  ];

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
        {cards.map((card) => (
          <div className="dashboard-card" key={card.titulo}>
            <div className="card-top">
              <div className="card-icon" style={{ backgroundColor: `${card.cor}22`, color: card.cor }}>
                {card.emoji}
              </div>
              <span className="card-title">{card.titulo}</span>
            </div>
            <h2>{card.valor}</h2>
            <p style={{ color: card.cor }}>{card.detalhe}</p>
          </div>
        ))}
      </section>

      <section className="dashboard-grid">
        <div className="panel panel-large">
          <div className="panel-header">
            <h3>Resumo financeiro</h3>
            <span className="panel-badge">Este mês</span>
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
            {lancamentos.map((item, index) => (
              <div className="list-row" key={index}>
                <div>
                  <strong>{item.nome}</strong>
                  <span>{item.tipo}</span>
                </div>
                <strong style={{ color: item.cor }}>{item.valor}</strong>
              </div>
            ))}
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

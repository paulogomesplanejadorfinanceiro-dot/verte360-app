import { useState } from "react";

export default function Dashboard({
  lancamentos = [],
  receitas = 0,
  despesas = 0,
  saldo = 0,
}) {
  function moeda(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  const hoje = new Date();
  const amanha = new Date();
  amanha.setDate(hoje.getDate() + 1);
  amanha.setHours(0, 0, 0, 0);

  function vencendoAmanha(item) {
    if (item.tipo !== "despesa") return false;
    if (!item.recorrente) return false;

    if (item.data_vencimento) {
      const dataVencimento = new Date(item.data_vencimento);
      dataVencimento.setHours(0, 0, 0, 0);

      return (
        dataVencimento.getDate() === amanha.getDate() &&
        dataVencimento.getMonth() === amanha.getMonth() &&
        dataVencimento.getFullYear() === amanha.getFullYear()
      );
    }

    if (item.dia_vencimento) {
      return Number(item.dia_vencimento) === amanha.getDate();
    }

    return false;
  }

  const despesasVencendoAmanha = lancamentos.filter(vencendoAmanha);

  return (
    <div className="dashboard-container">
      {/* Estilos CSS Dinâmicos para Celular vs Computador */}
      <style>{`
        .dashboard-container {
          min-height: 100vh;
          background: #07152d;
          color: #ffffff;
          padding: 32px;
          box-sizing: border-box;
        }

        .dash-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 24px;
        }

        .dash-title {
          margin: 0;
          font-size: 48px;
          font-weight: 800;
        }

        .dash-subtitle {
          margin-top: 8px;
          margin-bottom: 0;
          font-size: 18px;
          color: #bfd2f3;
        }

        .periodo-box {
          background: #0b1d38;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          padding: 14px 18px;
          min-width: 180px;
        }

        .periodo-label {
          font-size: 13px;
          color: #a8c1eb;
          margin-bottom: 6px;
        }

        .periodo-valor {
          font-size: 18px;
          font-weight: 700;
          color: #ffffff;
        }

        /* GRID DE CARDS RESPONSIVO */
        .dash-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
          margin-bottom: 20px;
        }

        .dash-card {
          background: #0b1d38;
          border-radius: 18px;
          padding: 22px;
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 12px 28px rgba(0,0,0,0.18);
          display: flex;
          align-items: flex-start;
          gap: 14px;
        }

        .card-icon-green {
          width: 46px; height: 46px; border-radius: 14px;
          background: rgba(34,197,94,0.18); color: #22c55e;
          display: flex; align-items: center; justify-content: center;
          font-size: 24px; font-weight: 800; flex-shrink: 0;
        }

        .card-icon-red {
          width: 46px; height: 46px; border-radius: 14px;
          background: rgba(239,68,68,0.18); color: #ef4444;
          display: flex; align-items: center; justify-content: center;
          font-size: 24px; font-weight: 800; flex-shrink: 0;
        }

        .card-icon-blue {
          width: 46px; height: 46px; border-radius: 14px;
          background: rgba(56,189,248,0.18); color: #38bdf8;
          display: flex; align-items: center; justify-content: center;
          font-size: 24px; font-weight: 800; flex-shrink: 0;
        }

        .dash-card-label {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .dash-card-value {
          font-size: 42px;
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 8px;
          word-break: break-all; /* Evita que o texto grande quebre o card */
        }

        .text-green { color: #22c55e; font-size: 15px; font-weight: 700; }
        .text-red { color: #ef4444; font-size: 15px; font-weight: 700; }

        .alerta-card {
          background: #0b1d38;
          border-radius: 18px;
          padding: 22px;
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 12px 28px rgba(0,0,0,0.18);
        }

        .alerta-topo {
          display: flex; justify-content: space-between; align-items: center;
          gap: 12px; flex-wrap: wrap; margin-bottom: 16px;
        }

        .alerta-titulo { font-size: 24px; font-weight: 800; }
        .alerta-badge {
          background: rgba(245,158,11,0.18); color: #f59e0b;
          padding: 8px 12px; border-radius: 999px; font-size: 13px; font-weight: 700;
        }

        .alerta-lista { display: flex; flexDirection: column; gap: 12px; }
        
        .alerta-item {
          display: flex; justify-content: space-between; align-items: center;
          gap: 16px; background: #10284d; border-radius: 14px; padding: 16px 18px;
        }

        .alerta-descricao { font-size: 18px; font-weight: 800; margin-bottom: 4px; }
        .alerta-sub { font-size: 14px; color: #b7c8e8; }
        .alerta-valor { font-size: 24px; font-weight: 800; color: #f59e0b; text-align: right; min-width: 120px; }

        /* REGRAS EXCLUSIVAS PARA CELULAR (MOBILE) */
        @media (max-width: 768px) {
          .dashboard-container {
            padding: 16px; /* Reduz margens externas */
          }

          .dash-title {
            font-size: 32px; /* Título menor para não ocupar a tela toda */
          }

          .dash-subtitle {
            font-size: 15px;
          }

          .periodo-box {
            width: 100%; /* Box de período ganha destaque total */
            box-sizing: border-box;
          }

          .dash-cards-grid {
            grid-template-columns: 1fr; /* MUDANÇA CRÍTICA: Cards ficam um abaixo do outro */
            gap: 14px;
          }

          .dash-card-value {
            font-size: 32px; /* Fonte ligeiramente menor para caber em qualquer celular sem cortar o R$ 0,00 */
          }
          
          .alerta-item {
            flex-direction: column; /* Alerta quebra em linhas no celular */
            align-items: flex-start;
            gap: 8px;
          }

          .alerta-valor {
            text-align: left;
            min-width: auto;
          }
        }
      `}</style>

      <div className="dash-header">
        <div>
          <h1 className="dash-title">Dashboard</h1>
          <p className="dash-subtitle">Visão geral da sua vida financeira.</p>
        </div>

        <div className="periodo-box">
          <div className="periodo-label">Período</div>
          <div className="periodo-valor">Resumo atual</div>
        </div>
      </div>

      {/* Grid que agora se adapta conforme o tamanho da tela */}
      <div className="dash-cards-grid">
        <div className="dash-card">
          <div className="card-icon-green">↗</div>
          <div>
            <div className="dash-card-label">Receitas</div>
            <div className="dash-card-value">{moeda(receitas)}</div>
            <div className="text-green">Total das entradas lançadas</div>
          </div>
        </div>

        <div className="dash-card">
          <div className="card-icon-red">↘</div>
          <div>
            <div className="dash-card-label">Despesas</div>
            <div className="dash-card-value">{moeda(despesas)}</div>
            <div className="text-red">Total das saídas lançadas</div>
          </div>
        </div>

        <div className="dash-card">
          <div className="dash-card">
            <div className="card-icon-blue">$</div>
            <div>
              <div className="dash-card-label">Saldo</div>
              <div className="dash-card-value">{moeda(saldo)}</div>
              <div className={`text-${saldo >= 0 ? "green" : "red"}`}>
                {saldo >= 0 ? "Saldo atual positivo" : "Saldo atual negativo"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {despesasVencendoAmanha.length > 0 && (
        <div className="alerta-card">
          <div className="alerta-topo">
            <div className="alerta-titulo">Despesas vencendo amanhã</div>
            <div className="alerta-badge">Atenção</div>
          </div>

          <div className="alerta-lista">
            {despesasVencendoAmanha.map((item) => (
              <div key={item.id} className="alerta-item">
                <div>
                  <div className="alerta-descricao">
                    {item.descricao || "Despesa recorrente"}
                  </div>
                  <div className="alerta-sub">
                    Vence amanhã
                    {item.dia_vencimento ? ` • Dia ${item.dia_vencimento}` : ""}
                  </div>
                </div>

                <div className="alerta-valor">{moeda(item.valor)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

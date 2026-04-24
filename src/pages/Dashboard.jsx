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
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Dashboard</h1>
          <p style={styles.subtitle}>Visão geral da sua vida financeira.</p>
        </div>

        <div style={styles.periodoBox}>
          <div style={styles.periodoLabel}>Período</div>
          <div style={styles.periodoValor}>Resumo atual</div>
        </div>
      </div>

      <div style={styles.cards}>
        <div style={styles.card}>
          <div style={styles.cardIconGreen}>↗</div>
          <div>
            <div style={styles.cardLabel}>Receitas</div>
            <div style={styles.cardValue}>{moeda(receitas)}</div>
            <div style={styles.cardTextGreen}>Total das entradas lançadas</div>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardIconRed}>↘</div>
          <div>
            <div style={styles.cardLabel}>Despesas</div>
            <div style={styles.cardValue}>{moeda(despesas)}</div>
            <div style={styles.cardTextRed}>Total das saídas lançadas</div>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardIconBlue}>$</div>
          <div>
            <div style={styles.cardLabel}>Saldo</div>
            <div style={styles.cardValue}>{moeda(saldo)}</div>
            <div
              style={
                saldo >= 0 ? styles.cardTextGreen : styles.cardTextRed
              }
            >
              {saldo >= 0 ? "Saldo atual positivo" : "Saldo atual negativo"}
            </div>
          </div>
        </div>
      </div>

      {despesasVencendoAmanha.length > 0 && (
        <div style={styles.alertaCard}>
          <div style={styles.alertaTopo}>
            <div style={styles.alertaTitulo}>Despesas vencendo amanhã</div>
            <div style={styles.alertaBadge}>Atenção</div>
          </div>

          <div style={styles.alertaLista}>
            {despesasVencendoAmanha.map((item) => (
              <div key={item.id} style={styles.alertaItem}>
                <div>
                  <div style={styles.alertaDescricao}>
                    {item.descricao || "Despesa recorrente"}
                  </div>
                  <div style={styles.alertaSub}>
                    Vence amanhã
                    {item.dia_vencimento
                      ? ` • Dia ${item.dia_vencimento}`
                      : ""}
                  </div>
                </div>

                <div style={styles.alertaValor}>{moeda(item.valor)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#07152d",
    color: "#ffffff",
    padding: "32px",
    boxSizing: "border-box",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "16px",
    flexWrap: "wrap",
    marginBottom: "24px",
  },

  title: {
    margin: 0,
    fontSize: "48px",
    fontWeight: "800",
  },

  subtitle: {
    marginTop: "8px",
    marginBottom: 0,
    fontSize: "18px",
    color: "#bfd2f3",
  },

  periodoBox: {
    background: "#0b1d38",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "14px",
    padding: "14px 18px",
    minWidth: "180px",
  },

  periodoLabel: {
    fontSize: "13px",
    color: "#a8c1eb",
    marginBottom: "6px",
  },

  periodoValor: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#ffffff",
  },

  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "18px",
    marginBottom: "20px",
  },

  card: {
    background: "#0b1d38",
    borderRadius: "18px",
    padding: "22px",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 12px 28px rgba(0,0,0,0.18)",
    display: "flex",
    alignItems: "flex-start",
    gap: "14px",
  },

  cardIconGreen: {
    width: "46px",
    height: "46px",
    borderRadius: "14px",
    background: "rgba(34,197,94,0.18)",
    color: "#22c55e",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    fontWeight: "800",
    flexShrink: 0,
  },

  cardIconRed: {
    width: "46px",
    height: "46px",
    borderRadius: "14px",
    background: "rgba(239,68,68,0.18)",
    color: "#ef4444",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    fontWeight: "800",
    flexShrink: 0,
  },

  cardIconBlue: {
    width: "46px",
    height: "46px",
    borderRadius: "14px",
    background: "rgba(56,189,248,0.18)",
    color: "#38bdf8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    fontWeight: "800",
    flexShrink: 0,
  },

  cardLabel: {
    fontSize: "18px",
    fontWeight: "700",
    marginBottom: "8px",
  },

  cardValue: {
    fontSize: "42px",
    fontWeight: "800",
    lineHeight: 1.1,
    marginBottom: "8px",
  },

  cardTextGreen: {
    color: "#22c55e",
    fontSize: "15px",
    fontWeight: "700",
  },

  cardTextRed: {
    color: "#ef4444",
    fontSize: "15px",
    fontWeight: "700",
  },

  alertaCard: {
    background: "#0b1d38",
    borderRadius: "18px",
    padding: "22px",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 12px 28px rgba(0,0,0,0.18)",
  },

  alertaTopo: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
    marginBottom: "16px",
  },

  alertaTitulo: {
    fontSize: "24px",
    fontWeight: "800",
  },

  alertaBadge: {
    background: "rgba(245,158,11,0.18)",
    color: "#f59e0b",
    padding: "8px 12px",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: "700",
  },

  alertaLista: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  alertaItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    background: "#10284d",
    borderRadius: "14px",
    padding: "16px 18px",
  },

  alertaDescricao: {
    fontSize: "18px",
    fontWeight: "800",
    marginBottom: "4px",
  },

  alertaSub: {
    fontSize: "14px",
    color: "#b7c8e8",
  },

  alertaValor: {
    fontSize: "24px",
    fontWeight: "800",
    color: "#f59e0b",
    textAlign: "right",
    minWidth: "120px",
  },
};

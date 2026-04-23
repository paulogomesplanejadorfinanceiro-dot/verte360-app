import { useState } from "react";

export default function Lancamentos({
  lancamentos = [],
  receitas = 0,
  despesas = 0,
  saldo = 0,
  onAddLancamento,
  onRemoveLancamento,
  loading = false,
}) {
  const [tipo, setTipo] = useState("receita");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");

  const gastos50 = receitas * 0.5;
  const investimentos30 = receitas * 0.3;
  const lazer20 = receitas * 0.2;

  function formatarMoeda(valorNumero) {
    return Number(valorNumero || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  async function handleAdicionar() {
    if (!valor) {
      alert("Digite o valor do lançamento.");
      return;
    }

    if (!onAddLancamento) return;

    await onAddLancamento({
      tipo,
      descricao,
      valor,
    });

    setTipo("receita");
    setDescricao("");
    setValor("");
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Lançamentos</h1>

      <div style={styles.cards}>
        <div style={styles.card}>
          <div style={styles.cardLabel}>Receitas</div>
          <div style={styles.cardValue}>{formatarMoeda(receitas)}</div>
          <div style={styles.cardInfoGreen}>Atualizado automaticamente</div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardLabel}>Despesas</div>
          <div style={styles.cardValue}>{formatarMoeda(despesas)}</div>
          <div style={styles.cardInfoRed}>Atualizado automaticamente</div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardLabel}>Saldo</div>
          <div style={styles.cardValue}>{formatarMoeda(saldo)}</div>
          <div style={styles.cardInfoBlue}>Atualizado automaticamente</div>
        </div>
      </div>

      <div style={styles.distribuicaoCard}>
        <h2 style={styles.sectionTitle}>Distribuição sugerida (50/30/20)</h2>

        <div style={styles.distribuicaoLinha}>
          <span>Gastos essenciais (50%)</span>
          <strong>{formatarMoeda(gastos50)}</strong>
        </div>

        <div style={styles.distribuicaoLinha}>
          <span>Investimentos (30%)</span>
          <strong>{formatarMoeda(investimentos30)}</strong>
        </div>

        <div style={styles.distribuicaoLinha}>
          <span>Lazer / estilo de vida (20%)</span>
          <strong>{formatarMoeda(lazer20)}</strong>
        </div>
      </div>

      <div style={styles.formCard}>
        <h2 style={styles.sectionTitle}>Novo lançamento</h2>

        <div style={styles.formRow}>
          <select
            style={styles.input}
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
          >
            <option value="receita">Receita</option>
            <option value="despesa">Despesa</option>
          </select>

          <input
            style={styles.input}
            type="text"
            placeholder="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />

          <input
            style={styles.input}
            type="number"
            placeholder="Valor"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
          />

          <button style={styles.addButton} onClick={handleAdicionar}>
            Adicionar
          </button>
        </div>
      </div>

      <div style={styles.historyCard}>
        <h2 style={styles.sectionTitle}>Histórico</h2>

        {loading ? (
          <p style={styles.emptyText}>Carregando...</p>
        ) : lancamentos.length === 0 ? (
          <p style={styles.emptyText}>Nenhum lançamento ainda.</p>
        ) : (
          <div style={styles.lista}>
            {lancamentos.map((item) => (
              <div key={item.id} style={styles.item}>
                <div>
                  <div style={styles.itemDescricao}>
                    {item.descricao || "Sem descrição"}
                  </div>
                  <div style={styles.itemTipo}>{item.tipo}</div>
                </div>

                <div style={styles.itemDireita}>
                  <div
                    style={{
                      ...styles.itemValor,
                      color: item.tipo === "receita" ? "#22c55e" : "#ef4444",
                    }}
                  >
                    {item.tipo === "despesa" ? "- " : ""}
                    {formatarMoeda(item.valor)}
                  </div>

                  <button
                    style={styles.deleteButton}
                    onClick={() => onRemoveLancamento && onRemoveLancamento(item.id)}
                  >
                    x
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
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

  title: {
    margin: 0,
    marginBottom: "24px",
    fontSize: "48px",
    fontWeight: "800",
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

  cardInfoGreen: {
    color: "#22c55e",
    fontSize: "15px",
    fontWeight: "700",
  },

  cardInfoRed: {
    color: "#ef4444",
    fontSize: "15px",
    fontWeight: "700",
  },

  cardInfoBlue: {
    color: "#38bdf8",
    fontSize: "15px",
    fontWeight: "700",
  },

  distribuicaoCard: {
    background: "#0b1d38",
    borderRadius: "18px",
    padding: "22px",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 12px 28px rgba(0,0,0,0.18)",
    marginBottom: "20px",
  },

  distribuicaoLinha: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    padding: "10px 0",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    fontSize: "16px",
  },

  formCard: {
    background: "#0b1d38",
    borderRadius: "18px",
    padding: "22px",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 12px 28px rgba(0,0,0,0.18)",
    marginBottom: "20px",
  },

  historyCard: {
    background: "#0b1d38",
    borderRadius: "18px",
    padding: "22px",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 12px 28px rgba(0,0,0,0.18)",
  },

  sectionTitle: {
    margin: 0,
    marginBottom: "18px",
    fontSize: "22px",
    fontWeight: "800",
  },

  formRow: {
    display: "grid",
    gridTemplateColumns: "180px 1fr 220px 160px",
    gap: "12px",
    alignItems: "center",
  },

  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "10px",
    border: "none",
    outline: "none",
    boxSizing: "border-box",
    fontSize: "15px",
  },

  addButton: {
    padding: "12px 14px",
    borderRadius: "10px",
    border: "none",
    background: "#2563eb",
    color: "#ffffff",
    fontWeight: "700",
    fontSize: "15px",
    cursor: "pointer",
  },

  lista: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  item: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    background: "#10284d",
    borderRadius: "14px",
    padding: "16px 18px",
  },

  itemDescricao: {
    fontSize: "22px",
    fontWeight: "800",
    marginBottom: "4px",
  },

  itemTipo: {
    fontSize: "15px",
    color: "#b7c8e8",
    textTransform: "lowercase",
  },

  itemDireita: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  itemValor: {
    fontSize: "28px",
    fontWeight: "800",
    minWidth: "170px",
    textAlign: "right",
  },

  deleteButton: {
    width: "34px",
    height: "34px",
    borderRadius: "8px",
    border: "none",
    background: "#ef4444",
    color: "#ffffff",
    fontWeight: "800",
    cursor: "pointer",
  },

  emptyText: {
    color: "#b7c8e8",
    fontSize: "15px",
  },
};

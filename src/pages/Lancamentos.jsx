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
  const isMobile =
    typeof window !== "undefined" ? window.innerWidth <= 768 : false;

  const [tipo, setTipo] = useState("receita");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [dataLancamento, setDataLancamento] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [recorrente, setRecorrente] = useState(false);
  const [diaVencimento, setDiaVencimento] = useState("");
  const [modoDistribuicao, setModoDistribuicao] = useState("receita");

  function formatarMoeda(valorNumero) {
    return Number(valorNumero || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function formatarData(data) {
    if (!data) return "Sem data";
    const d = new Date(`${data}T00:00:00`);
    return d.toLocaleDateString("pt-BR");
  }

  async function handleAdicionar() {
    if (!descricao.trim()) {
      alert("Digite a descrição do lançamento.");
      return;
    }

    if (!valor) {
      alert("Digite o valor do lançamento.");
      return;
    }

    if (!dataLancamento) {
      alert("Selecione a data do lançamento.");
      return;
    }

    if (recorrente && !diaVencimento) {
      alert("Informe o dia do vencimento/recebimento.");
      return;
    }

    if (!onAddLancamento) return;

    await onAddLancamento({
      tipo,
      descricao,
      valor,
      data_lancamento: dataLancamento,
      recorrente,
      dia_vencimento: recorrente ? diaVencimento : null,
    });

    setTipo("receita");
    setDescricao("");
    setValor("");
    setDataLancamento(new Date().toISOString().slice(0, 10));
    setRecorrente(false);
    setDiaVencimento("");
  }

  const baseCalculo =
    modoDistribuicao === "receita" ? receitas : saldo > 0 ? saldo : 0;

  const distribuicao =
    modoDistribuicao === "receita"
      ? [
          {
            label: "Despesas essenciais (60%)",
            valor: baseCalculo * 0.6,
          },
          {
            label: "Investimentos (20%)",
            valor: baseCalculo * 0.2,
          },
          {
            label: "Lazer / qualidade de vida (20%)",
            valor: baseCalculo * 0.2,
          },
        ]
      : [
          {
            label: "Investir e crescer (60%)",
            valor: baseCalculo * 0.6,
          },
          {
            label: "Viver / aproveitar (30%)",
            valor: baseCalculo * 0.3,
          },
          {
            label: "Segurança / imprevistos (10%)",
            valor: baseCalculo * 0.1,
          },
        ];

  const textoExplicativo =
    modoDistribuicao === "receita"
      ? "Essa é a forma ideal de organizar sua renda mensal."
      : "Essa é a melhor forma de usar o dinheiro que sobrou.";

  return (
    <div style={styles.container(isMobile)}>
      <h1 style={styles.title(isMobile)}>Lançamentos</h1>

      <div style={styles.cards(isMobile)}>
        <div style={styles.card}>
          <div style={styles.cardLabel}>Receitas</div>
          <div style={styles.cardValue(isMobile)}>{formatarMoeda(receitas)}</div>
          <div style={styles.cardInfoGreen}>Atualizado automaticamente</div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardLabel}>Despesas</div>
          <div style={styles.cardValue(isMobile)}>{formatarMoeda(despesas)}</div>
          <div style={styles.cardInfoRed}>Atualizado automaticamente</div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardLabel}>Saldo</div>
          <div style={styles.cardValue(isMobile)}>{formatarMoeda(saldo)}</div>
          <div style={styles.cardInfoBlue}>Atualizado automaticamente</div>
        </div>
      </div>

      <div style={styles.distribuicaoCard}>
        <div style={styles.distribuicaoHeader(isMobile)}>
          <div>
            <h2 style={styles.sectionTitle}>Como usar seu dinheiro</h2>
            <p style={styles.distribuicaoTexto}>{textoExplicativo}</p>
          </div>

          <div style={styles.toggleWrap}>
            <button
              style={{
                ...styles.toggleButton,
                ...(modoDistribuicao === "receita" ? styles.toggleAtivo : {}),
              }}
              onClick={() => setModoDistribuicao("receita")}
            >
              Receita
            </button>

            <button
              style={{
                ...styles.toggleButton,
                ...(modoDistribuicao === "saldo" ? styles.toggleAtivo : {}),
              }}
              onClick={() => setModoDistribuicao("saldo")}
            >
              Saldo
            </button>
          </div>
        </div>

        <div style={styles.baseInfo}>
          Base de cálculo: <strong>{formatarMoeda(baseCalculo)}</strong>
        </div>

        {distribuicao.map((item) => (
          <div key={item.label} style={styles.distribuicaoLinha}>
            <span>{item.label}</span>
            <strong>{formatarMoeda(item.valor)}</strong>
          </div>
        ))}
      </div>

      <div style={styles.formCard}>
        <h2 style={styles.sectionTitle}>Novo lançamento</h2>

        <div style={styles.formGrid(isMobile)}>
          <div>
            <label style={styles.label}>Tipo</label>
            <select
              style={styles.input}
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
            >
              <option value="receita">Receita</option>
              <option value="despesa">Despesa</option>
            </select>
          </div>

          <div>
            <label style={styles.label}>
              Descrição {tipo === "receita" ? "da receita" : "da despesa"}
            </label>
            <input
              style={styles.input}
              type="text"
              placeholder={
                tipo === "receita"
                  ? "Ex: iFood almoço"
                  : "Ex: gasolina da moto"
              }
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </div>

          <div>
            <label style={styles.label}>Valor</label>
            <input
              style={styles.input}
              type="number"
              placeholder="0,00"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
            />
          </div>

          <div>
            <label style={styles.label}>Data</label>
            <input
              style={styles.input}
              type="date"
              value={dataLancamento}
              onChange={(e) => setDataLancamento(e.target.value)}
            />
          </div>

          <div>
            <label style={styles.label}>É recorrente?</label>
            <select
              style={styles.input}
              value={recorrente ? "sim" : "nao"}
              onChange={(e) => setRecorrente(e.target.value === "sim")}
            >
              <option value="nao">Não</option>
              <option value="sim">Sim</option>
            </select>
          </div>

          {recorrente && (
            <div>
              <label style={styles.label}>
                {tipo === "despesa"
                  ? "Dia do vencimento"
                  : "Dia do recebimento"}
              </label>
              <input
                style={styles.input}
                type="number"
                min="1"
                max="31"
                placeholder="Ex: 10"
                value={diaVencimento}
                onChange={(e) => setDiaVencimento(e.target.value)}
              />
            </div>
          )}
        </div>

        <div style={styles.buttonArea}>
          <button style={styles.addButton} onClick={handleAdicionar}>
            Adicionar lançamento
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
              <div key={item.id} style={styles.item(isMobile)}>
                <div style={styles.itemEsquerda}>
                  <div style={styles.itemDescricao}>
                    {item.descricao || "Sem descrição"}
                  </div>

                  <div style={styles.itemInfo}>
                    <span>{item.tipo}</span>
                    <span>•</span>
                    <span>
                      {formatarData(item.data_lancamento || item.created_at)}
                    </span>

                    {item.recorrente && (
                      <>
                        <span>•</span>
                        <span>
                          Recorrente
                          {item.dia_vencimento
                            ? ` • dia ${item.dia_vencimento}`
                            : ""}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div style={styles.itemDireita(isMobile)}>
                  <div
                    style={{
                      ...styles.itemValor(isMobile),
                      color: item.tipo === "receita" ? "#22c55e" : "#ef4444",
                    }}
                  >
                    {item.tipo === "despesa" ? "- " : "+ "}
                    {formatarMoeda(item.valor)}
                  </div>

                  <button
                    style={styles.deleteButton}
                    onClick={() =>
                      onRemoveLancamento && onRemoveLancamento(item.id)
                    }
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
  container: (isMobile) => ({
    minHeight: "100vh",
    background: "#07152d",
    color: "#ffffff",
    padding: isMobile ? "16px" : "32px",
    boxSizing: "border-box",
  }),

  title: (isMobile) => ({
    margin: 0,
    marginBottom: "24px",
    fontSize: isMobile ? "34px" : "48px",
    fontWeight: "800",
  }),

  cards: (isMobile) => ({
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "repeat(3, minmax(0, 1fr))",
    gap: "18px",
    marginBottom: "20px",
  }),

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

  cardValue: (isMobile) => ({
    fontSize: isMobile ? "34px" : "42px",
    fontWeight: "800",
    lineHeight: 1.1,
    marginBottom: "8px",
  }),

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

  distribuicaoHeader: (isMobile) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: isMobile ? "stretch" : "flex-start",
    flexDirection: isMobile ? "column" : "row",
    gap: "16px",
    flexWrap: "wrap",
    marginBottom: "12px",
  }),

  distribuicaoTexto: {
    margin: 0,
    color: "#b7c8e8",
    fontSize: "15px",
  },

  toggleWrap: {
    display: "flex",
    gap: "8px",
    background: "#10284d",
    padding: "6px",
    borderRadius: "12px",
    width: "fit-content",
  },

  toggleButton: {
    border: "none",
    padding: "10px 16px",
    borderRadius: "10px",
    background: "transparent",
    color: "#dbeafe",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "14px",
  },

  toggleAtivo: {
    background: "#2563eb",
    color: "#ffffff",
  },

  baseInfo: {
    marginBottom: "12px",
    color: "#dbeafe",
    fontSize: "15px",
  },

  distribuicaoLinha: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    padding: "12px 0",
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

  formGrid: (isMobile) => ({
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "repeat(3, minmax(0, 1fr))",
    gap: "12px",
    alignItems: "end",
  }),

  label: {
    display: "block",
    marginBottom: "6px",
    fontSize: "14px",
    color: "#dbeafe",
    fontWeight: "600",
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

  buttonArea: {
    marginTop: "16px",
  },

  addButton: {
    padding: "12px 18px",
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

  item: (isMobile) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: isMobile ? "flex-start" : "center",
    flexDirection: isMobile ? "column" : "row",
    gap: "16px",
    background: "#10284d",
    borderRadius: "14px",
    padding: "16px 18px",
  }),

  itemEsquerda: {
    flex: 1,
    minWidth: 0,
  },

  itemDescricao: {
    fontSize: "20px",
    fontWeight: "800",
    marginBottom: "6px",
  },

  itemInfo: {
    fontSize: "14px",
    color: "#b7c8e8",
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
  },

  itemDireita: (isMobile) => ({
    display: "flex",
    alignItems: "center",
    gap: "12px",
    width: isMobile ? "100%" : "auto",
    justifyContent: isMobile ? "space-between" : "flex-end",
  }),

  itemValor: (isMobile) => ({
    fontSize: isMobile ? "22px" : "28px",
    fontWeight: "800",
    textAlign: "right",
  }),

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

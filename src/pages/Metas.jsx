import { useState } from "react";

export default function Metas({
  metas = [],
  onAddMeta,
  onRemoveMeta,
  onAddValorMeta,
  loading = false,
}) {
  const isMobile =
    typeof window !== "undefined" ? window.innerWidth <= 768 : false;

  const [titulo, setTitulo] = useState("");
  const [valorObjetivo, setValorObjetivo] = useState("");
  const [valorAtual, setValorAtual] = useState("");
  const [aportes, setAportes] = useState({});

  function moeda(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function calcularPercentual(meta) {
    const objetivo = Number(meta.valor_objetivo || 0);
    const atual = Number(meta.valor_atual || 0);

    if (objetivo <= 0) return 0;

    const percentual = (atual / objetivo) * 100;
    return percentual > 100 ? 100 : percentual;
  }

  function mensagemMeta(percentual) {
    if (percentual >= 100) {
      return "Meta concluída. Parabéns!";
    }

    if (percentual >= 95) {
      return "Falta muito pouco. Sua meta está quase concluída.";
    }

    if (percentual >= 75) {
      return "Está quase no fim. Não deixe sua meta de lado.";
    }

    if (percentual >= 50) {
      return "Você já passou da metade. Continue firme.";
    }

    if (percentual >= 25) {
      return "Boa evolução. Sua meta já saiu do papel.";
    }

    return "Você está começando. Não pare agora.";
  }

  async function adicionarMeta() {
    if (!titulo.trim()) {
      alert("Digite o nome da meta.");
      return;
    }

    if (!valorObjetivo) {
      alert("Digite o valor objetivo.");
      return;
    }

    if (!onAddMeta) return;

    await onAddMeta({
      titulo: titulo.trim(),
      valor_objetivo: Number(valorObjetivo),
      valor_atual: Number(valorAtual || 0),
    });

    setTitulo("");
    setValorObjetivo("");
    setValorAtual("");
  }

  async function adicionarValor(metaId) {
    const valor = Number(aportes[metaId] || 0);

    if (!valor || valor <= 0) {
      alert("Digite um valor válido para adicionar à meta.");
      return;
    }

    if (!onAddValorMeta) return;

    await onAddValorMeta(metaId, valor);

    setAportes((prev) => ({
      ...prev,
      [metaId]: "",
    }));
  }

  return (
    <div style={styles.container(isMobile)}>
      <h1 style={styles.title(isMobile)}>Metas</h1>
      <p style={styles.subtitle}>
        Crie objetivos, acompanhe sua evolução e veja quanto falta para chegar lá.
      </p>

      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>Nova meta</h2>

        <div style={styles.formGrid(isMobile)}>
          <div>
            <label style={styles.label}>Nome da meta</label>
            <input
              style={styles.input}
              type="text"
              placeholder="Ex: Comprar moto"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
          </div>

          <div>
            <label style={styles.label}>Valor objetivo</label>
            <input
              style={styles.input}
              type="number"
              placeholder="Ex: 10000"
              value={valorObjetivo}
              onChange={(e) => setValorObjetivo(e.target.value)}
            />
          </div>

          <div>
            <label style={styles.label}>Valor atual</label>
            <input
              style={styles.input}
              type="number"
              placeholder="Ex: 2000"
              value={valorAtual}
              onChange={(e) => setValorAtual(e.target.value)}
            />
          </div>
        </div>

        <div style={styles.buttonArea}>
          <button style={styles.button} onClick={adicionarMeta}>
            Adicionar meta
          </button>
        </div>
      </div>

      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>Minhas metas</h2>

        {loading ? (
          <p style={styles.emptyText}>Carregando...</p>
        ) : metas.length === 0 ? (
          <p style={styles.emptyText}>Nenhuma meta cadastrada ainda.</p>
        ) : (
          <div style={styles.lista}>
            {metas.map((meta) => {
              const percentual = calcularPercentual(meta);
              const falta =
                Number(meta.valor_objetivo || 0) - Number(meta.valor_atual || 0);

              return (
                <div key={meta.id} style={styles.metaCard}>
                  <div style={styles.metaHeader(isMobile)}>
                    <div>
                      <div style={styles.metaTitulo}>{meta.titulo}</div>
                      <div style={styles.metaMensagem}>
                        {mensagemMeta(percentual)}
                      </div>
                    </div>

                    <button
                      style={styles.deleteButton}
                      onClick={() => onRemoveMeta && onRemoveMeta(meta.id)}
                    >
                      Excluir
                    </button>
                  </div>

                  <div style={styles.metaLinha}>
                    <span>Objetivo</span>
                    <strong>{moeda(meta.valor_objetivo)}</strong>
                  </div>

                  <div style={styles.metaLinha}>
                    <span>Atual</span>
                    <strong>{moeda(meta.valor_atual)}</strong>
                  </div>

                  <div style={styles.metaLinha}>
                    <span>Falta</span>
                    <strong>{moeda(falta > 0 ? falta : 0)}</strong>
                  </div>

                  <div style={styles.metaLinha}>
                    <span>Progresso</span>
                    <strong>{percentual.toFixed(1)}%</strong>
                  </div>

                  <div style={styles.barra}>
                    <div
                      style={{
                        ...styles.progresso,
                        width: `${percentual}%`,
                      }}
                    />
                  </div>

                  <div style={styles.aporteArea(isMobile)}>
                    <input
                      style={styles.input}
                      type="number"
                      placeholder="Adicionar valor"
                      value={aportes[meta.id] || ""}
                      onChange={(e) =>
                        setAportes((prev) => ({
                          ...prev,
                          [meta.id]: e.target.value,
                        }))
                      }
                    />

                    <button
                      style={styles.addValorButton}
                      onClick={() => adicionarValor(meta.id)}
                    >
                      Adicionar valor
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: (isMobile) => ({
    padding: isMobile ? "16px" : "30px",
    background: "#07152d",
    minHeight: "100vh",
    color: "#fff",
    boxSizing: "border-box",
  }),

  title: (isMobile) => ({
    fontSize: isMobile ? "34px" : "40px",
    marginBottom: "6px",
    fontWeight: "800",
  }),

  subtitle: {
    marginBottom: "20px",
    color: "#a0b3d6",
    fontSize: "15px",
  },

  card: {
    background: "#0b1d38",
    padding: "20px",
    borderRadius: "16px",
    marginBottom: "20px",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 12px 28px rgba(0,0,0,0.18)",
  },

  sectionTitle: {
    marginTop: 0,
    marginBottom: "16px",
    fontSize: "24px",
    fontWeight: "800",
  },

  formGrid: (isMobile) => ({
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr",
    gap: "12px",
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

  button: {
    padding: "12px 16px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "15px",
  },

  lista: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

  metaCard: {
    background: "#10284d",
    borderRadius: "14px",
    padding: "16px",
  },

  metaHeader: (isMobile) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: isMobile ? "flex-start" : "center",
    flexDirection: isMobile ? "column" : "row",
    gap: "12px",
    marginBottom: "14px",
  }),

  metaTitulo: {
    fontSize: "22px",
    fontWeight: "800",
    marginBottom: "6px",
  },

  metaMensagem: {
    color: "#b7c8e8",
    fontSize: "14px",
  },

  metaLinha: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
    color: "#dbeafe",
    fontSize: "15px",
  },

  barra: {
    height: "12px",
    background: "#1e3a5f",
    borderRadius: "999px",
    overflow: "hidden",
    marginBottom: "14px",
  },

  progresso: {
    height: "100%",
    background: "linear-gradient(90deg, #22c55e 0%, #4ade80 100%)",
  },

  aporteArea: (isMobile) => ({
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "1fr 180px",
    gap: "12px",
    marginTop: "10px",
  }),

  addValorButton: {
    padding: "12px 16px",
    background: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "15px",
  },

  deleteButton: {
    background: "#dc2626",
    border: "none",
    padding: "10px 14px",
    color: "#fff",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "700",
  },

  emptyText: {
    color: "#c7d7f2",
    fontSize: "15px",
  },
};

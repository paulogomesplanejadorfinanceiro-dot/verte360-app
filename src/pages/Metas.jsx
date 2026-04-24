import { useState } from "react";

export default function Metas({
  metas = [],
  onAddMeta,
  onRemoveMeta,
  loading = false,
}) {
  const [titulo, setTitulo] = useState("");
  const [valorObjetivo, setValorObjetivo] = useState("");
  const [valorAtual, setValorAtual] = useState("");

  function moeda(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  async function adicionarMeta() {
    if (!titulo.trim() || !valorObjetivo) {
      alert("Preencha o título e o valor objetivo.");
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

  function calcularPercentual(meta) {
    const objetivo = Number(meta.valor_objetivo || 0);
    const atual = Number(meta.valor_atual || 0);

    if (objetivo <= 0) return 0;

    const percentual = (atual / objetivo) * 100;
    return percentual > 100 ? 100 : percentual;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Metas</h1>
      <p style={styles.subtitle}>
        Crie objetivos e acompanhe quanto falta para chegar lá.
      </p>

      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>Nova meta</h2>

        <div style={styles.formGrid}>
          <input
            style={styles.input}
            type="text"
            placeholder="Ex: Comprar moto"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />

          <input
            style={styles.input}
            type="number"
            placeholder="Valor objetivo"
            value={valorObjetivo}
            onChange={(e) => setValorObjetivo(e.target.value)}
          />

          <input
            style={styles.input}
            type="number"
            placeholder="Valor atual"
            value={valorAtual}
            onChange={(e) => setValorAtual(e.target.value)}
          />

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
                  <div style={styles.metaHeader}>
                    <strong style={styles.metaTitulo}>{meta.titulo}</strong>

                    <button
                      style={styles.deleteButton}
                      onClick={() => onRemoveMeta && onRemoveMeta(meta.id)}
                    >
                      Excluir
                    </button>
                  </div>

                  <div style={styles.metaValores}>
                    <span>
                      {moeda(meta.valor_atual)} / {moeda(meta.valor_objetivo)}
                    </span>
                    <span>{percentual.toFixed(1)}%</span>
                  </div>

                  <div style={styles.barra}>
                    <div
                      style={{
                        ...styles.progresso,
                        width: `${percentual}%`,
                      }}
                    />
                  </div>

                  <div style={styles.faltaText}>
                    Falta: {moeda(falta > 0 ? falta : 0)}
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
  container: {
    padding: "30px",
    background: "#07152d",
    minHeight: "100vh",
    color: "#fff",
    boxSizing: "border-box",
  },

  title: {
    fontSize: "40px",
    marginBottom: "5px",
  },

  subtitle: {
    marginBottom: "20px",
    color: "#a0b3d6",
  },

  card: {
    background: "#0b1d38",
    padding: "20px",
    borderRadius: "16px",
    marginBottom: "20px",
    border: "1px solid rgba(255,255,255,0.08)",
  },

  sectionTitle: {
    marginTop: 0,
    marginBottom: "16px",
    fontSize: "24px",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr 180px",
    gap: "12px",
  },

  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    outline: "none",
    boxSizing: "border-box",
  },

  button: {
    padding: "12px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "700",
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

  metaHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    marginBottom: "10px",
  },

  metaTitulo: {
    fontSize: "20px",
  },

  metaValores: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
    color: "#dbeafe",
  },

  barra: {
    height: "12px",
    background: "#1e3a5f",
    borderRadius: "999px",
    overflow: "hidden",
    marginBottom: "10px",
  },

  progresso: {
    height: "100%",
    background: "#4ade80",
  },

  faltaText: {
    color: "#c7d7f2",
    fontSize: "14px",
  },

  deleteButton: {
    background: "#dc2626",
    border: "none",
    padding: "8px 12px",
    color: "#fff",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "700",
  },

  emptyText: {
    color: "#c7d7f2",
  },
};

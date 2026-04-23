import { useState } from "react";

export default function MetasPage() {
  const [metas, setMetas] = useState([]);

  const [form, setForm] = useState({
    titulo: "",
    valorObjetivo: "",
    valorAtual: "",
  });

  function atualizarCampo(campo, valor) {
    setForm((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  }

  function adicionarMeta() {
    if (!form.titulo || !form.valorObjetivo) {
      alert("Preencha os campos obrigatórios");
      return;
    }

    setMetas((prev) => [
      {
        id: Date.now(),
        titulo: form.titulo,
        valorObjetivo: Number(form.valorObjetivo),
        valorAtual: Number(form.valorAtual || 0),
      },
      ...prev,
    ]);

    setForm({
      titulo: "",
      valorObjetivo: "",
      valorAtual: "",
    });
  }

  function removerMeta(id) {
    setMetas((prev) => prev.filter((meta) => meta.id !== id));
  }

  function calcularPercentual(meta) {
    if (meta.valorObjetivo === 0) return 0;
    return (meta.valorAtual / meta.valorObjetivo) * 100;
  }

  function moeda(valor) {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Metas</h1>

      <div style={styles.card}>
        <h2>Nova meta</h2>

        <input
          style={styles.input}
          placeholder="Ex: Comprar moto"
          value={form.titulo}
          onChange={(e) => atualizarCampo("titulo", e.target.value)}
        />

        <input
          style={styles.input}
          type="number"
          placeholder="Valor objetivo"
          value={form.valorObjetivo}
          onChange={(e) => atualizarCampo("valorObjetivo", e.target.value)}
        />

        <input
          style={styles.input}
          type="number"
          placeholder="Valor atual"
          value={form.valorAtual}
          onChange={(e) => atualizarCampo("valorAtual", e.target.value)}
        />

        <button style={styles.button} onClick={adicionarMeta}>
          Adicionar meta
        </button>
      </div>

      <div style={styles.card}>
        <h2>Minhas metas</h2>

        {metas.length === 0 && <p>Nenhuma meta ainda</p>}

        {metas.map((meta) => {
          const percentual = calcularPercentual(meta);

          return (
            <div key={meta.id} style={styles.meta}>
              <strong>{meta.titulo}</strong>

              <p>{moeda(meta.valorAtual)} / {moeda(meta.valorObjetivo)}</p>

              <div style={styles.barra}>
                <div
                  style={{
                    ...styles.progresso,
                    width: `${percentual}%`,
                  }}
                />
              </div>

              <p>{percentual.toFixed(1)}%</p>

              <button
                style={styles.delete}
                onClick={() => removerMeta(meta.id)}
              >
                Excluir
              </button>
            </div>
          );
        })}
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
  },

  title: {
    fontSize: "40px",
    marginBottom: "20px",
  },

  card: {
    background: "#0b1d38",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "20px",
  },

  input: {
    display: "block",
    width: "100%",
    marginBottom: "10px",
    padding: "10px",
    borderRadius: "8px",
    border: "none",
  },

  button: {
    padding: "10px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },

  meta: {
    borderTop: "1px solid #1e3a5f",
    paddingTop: "10px",
    marginTop: "10px",
  },

  barra: {
    height: "10px",
    background: "#1e3a5f",
    borderRadius: "5px",
    overflow: "hidden",
    marginTop: "5px",
  },

  progresso: {
    height: "100%",
    background: "#4ade80",
  },

  delete: {
    marginTop: "10px",
    background: "#dc2626",
    border: "none",
    padding: "8px",
    color: "#fff",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

import { useMemo, useState } from "react";

export default function EmBranco() {
  const [investimentos, setInvestimentos] = useState([
    {
      id: 1,
      nome: "CDB Banco Inter",
      tipo: "Renda Fixa",
      instituicao: "Banco Inter",
      valorAplicado: 10000,
      valorAtual: 10850,
    },
    {
      id: 2,
      nome: "PETR4",
      tipo: "Ações",
      instituicao: "XP Investimentos",
      valorAplicado: 5000,
      valorAtual: 5600,
    },
  ]);

  const [form, setForm] = useState({
    nome: "",
    tipo: "Renda Fixa",
    instituicao: "",
    valorAplicado: "",
    valorAtual: "",
  });

  const [editandoId, setEditandoId] = useState(null);

  function atualizarCampo(campo, valor) {
    setForm((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  }

  function limparFormulario() {
    setForm({
      nome: "",
      tipo: "Renda Fixa",
      instituicao: "",
      valorAplicado: "",
      valorAtual: "",
    });
    setEditandoId(null);
  }

  function salvarInvestimento() {
    if (
      !form.nome.trim() ||
      !form.tipo.trim() ||
      !form.instituicao.trim() ||
      form.valorAplicado === "" ||
      form.valorAtual === ""
    ) {
      alert("Preencha todos os campos do investimento.");
      return;
    }

    const payload = {
      nome: form.nome.trim(),
      tipo: form.tipo,
      instituicao: form.instituicao.trim(),
      valorAplicado: Number(form.valorAplicado),
      valorAtual: Number(form.valorAtual),
    };

    if (editandoId) {
      setInvestimentos((prev) =>
        prev.map((item) =>
          item.id === editandoId ? { ...item, ...payload } : item
        )
      );
    } else {
      setInvestimentos((prev) => [
        {
          id: Date.now(),
          ...payload,
        },
        ...prev,
      ]);
    }

    limparFormulario();
  }

  function editarInvestimento(item) {
    setEditandoId(item.id);
    setForm({
      nome: item.nome,
      tipo: item.tipo,
      instituicao: item.instituicao,
      valorAplicado: String(item.valorAplicado),
      valorAtual: String(item.valorAtual),
    });
  }

  function excluirInvestimento(id) {
    setInvestimentos((prev) => prev.filter((item) => item.id !== id));

    if (editandoId === id) {
      limparFormulario();
    }
  }

  const resumo = useMemo(() => {
    const totalInvestido = investimentos.reduce(
      (acc, item) => acc + Number(item.valorAplicado || 0),
      0
    );

    const patrimonioTotal = investimentos.reduce(
      (acc, item) => acc + Number(item.valorAtual || 0),
      0
    );

    const rentabilidadeTotal = patrimonioTotal - totalInvestido;

    const rentabilidadePercentual =
      totalInvestido > 0 ? (rentabilidadeTotal / totalInvestido) * 100 : 0;

    return {
      totalInvestido,
      patrimonioTotal,
      rentabilidadeTotal,
      rentabilidadePercentual,
    };
  }, [investimentos]);

  function moeda(valor) {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function percentual(valor) {
    return `${valor.toFixed(2)}%`;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Investimentos</h1>
          <p style={styles.subtitle}>
            Cadastre, edite e acompanhe seus investimentos.
          </p>
        </div>
      </div>

      <div style={styles.cards}>
        <div style={styles.card}>
          <div style={styles.cardLabel}>Patrimônio total</div>
          <div style={styles.cardValue}>{moeda(resumo.patrimonioTotal)}</div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardLabel}>Total investido</div>
          <div style={styles.cardValue}>{moeda(resumo.totalInvestido)}</div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardLabel}>Rentabilidade total</div>
          <div
            style={{
              ...styles.cardValue,
              color: resumo.rentabilidadeTotal >= 0 ? "#4ade80" : "#fb7185",
            }}
          >
            {moeda(resumo.rentabilidadeTotal)}
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardLabel}>Rentabilidade %</div>
          <div
            style={{
              ...styles.cardValue,
              color: resumo.rentabilidadePercentual >= 0 ? "#4ade80" : "#fb7185",
            }}
          >
            {percentual(resumo.rentabilidadePercentual)}
          </div>
        </div>
      </div>

      <div style={styles.panel}>
        <div style={styles.panelTitle}>
          {editandoId ? "Editar investimento" : "Novo investimento"}
        </div>

        <div style={styles.formGrid}>
          <div style={styles.field}>
            <label style={styles.label}>Nome</label>
            <input
              style={styles.input}
              value={form.nome}
              onChange={(e) => atualizarCampo("nome", e.target.value)}
              placeholder="Ex: CDB Banco Inter"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Tipo</label>
            <select
              style={styles.input}
              value={form.tipo}
              onChange={(e) => atualizarCampo("tipo", e.target.value)}
            >
              <option>Renda Fixa</option>
              <option>Ações</option>
              <option>Fundos Imobiliários</option>
              <option>Criptomoedas</option>
              <option>Reserva</option>
              <option>Outros</option>
            </select>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Instituição</label>
            <input
              style={styles.input}
              value={form.instituicao}
              onChange={(e) => atualizarCampo("instituicao", e.target.value)}
              placeholder="Ex: XP Investimentos"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Valor aplicado</label>
            <input
              style={styles.input}
              type="number"
              value={form.valorAplicado}
              onChange={(e) => atualizarCampo("valorAplicado", e.target.value)}
              placeholder="0,00"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Valor atual</label>
            <input
              style={styles.input}
              type="number"
              value={form.valorAtual}
              onChange={(e) => atualizarCampo("valorAtual", e.target.value)}
              placeholder="0,00"
            />
          </div>
        </div>

        <div style={styles.buttonRow}>
          <button style={styles.primaryButton} onClick={salvarInvestimento}>
            {editandoId ? "Salvar alterações" : "Adicionar investimento"}
          </button>

          <button style={styles.secondaryButton} onClick={limparFormulario}>
            Limpar
          </button>
        </div>
      </div>

      <div style={styles.panel}>
        <div style={styles.panelTitle}>Meus investimentos</div>

        {investimentos.length === 0 ? (
          <div style={styles.emptyState}>Nenhum investimento cadastrado ainda.</div>
        ) : (
          <div style={styles.tableWrap}>
            <div style={styles.tableHeader}>
              <div>Nome</div>
              <div>Tipo</div>
              <div>Instituição</div>
              <div>Aplicado</div>
              <div>Atual</div>
              <div>Lucro</div>
              <div>Ações</div>
            </div>

            {investimentos.map((item) => {
              const lucro = Number(item.valorAtual) - Number(item.valorAplicado);

              return (
                <div key={item.id} style={styles.tableRow}>
                  <div style={styles.tableTextStrong}>{item.nome}</div>
                  <div style={styles.tableText}>{item.tipo}</div>
                  <div style={styles.tableText}>{item.instituicao}</div>
                  <div style={styles.tableText}>{moeda(Number(item.valorAplicado))}</div>
                  <div style={styles.tableText}>{moeda(Number(item.valorAtual))}</div>
                  <div
                    style={{
                      ...styles.tableTextStrong,
                      color: lucro >= 0 ? "#4ade80" : "#fb7185",
                    }}
                  >
                    {moeda(lucro)}
                  </div>
                  <div style={styles.actionRow}>
                    <button
                      style={styles.editButton}
                      onClick={() => editarInvestimento(item)}
                    >
                      Editar
                    </button>

                    <button
                      style={styles.deleteButton}
                      onClick={() => excluirInvestimento(item.id)}
                    >
                      Excluir
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
    alignItems: "center",
    gap: "20px",
    marginBottom: "24px",
  },

  title: {
    margin: 0,
    fontSize: "44px",
    fontWeight: "800",
    lineHeight: 1.1,
  },

  subtitle: {
    marginTop: "6px",
    marginBottom: 0,
    fontSize: "16px",
    color: "#a9bddf",
  },

  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: "16px",
    marginBottom: "20px",
  },

  card: {
    background: "#0b1d38",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "18px",
    padding: "20px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
  },

  cardLabel: {
    fontSize: "14px",
    color: "#c7d7f2",
    marginBottom: "10px",
  },

  cardValue: {
    fontSize: "30px",
    fontWeight: "800",
  },

  panel: {
    background: "#0b1d38",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "18px",
    padding: "22px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
    marginBottom: "20px",
  },

  panelTitle: {
    fontSize: "28px",
    fontWeight: "800",
    marginBottom: "18px",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "16px",
  },

  field: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  label: {
    fontSize: "14px",
    color: "#d6e4ff",
    fontWeight: "600",
  },

  input: {
    width: "100%",
    background: "#10284d",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "12px",
    padding: "14px 16px",
    color: "#ffffff",
    fontSize: "15px",
    boxSizing: "border-box",
    outline: "none",
  },

  buttonRow: {
    display: "flex",
    gap: "12px",
    marginTop: "20px",
    flexWrap: "wrap",
  },

  primaryButton: {
    border: "none",
    borderRadius: "12px",
    padding: "14px 18px",
    background: "linear-gradient(90deg, #2563eb 0%, #38bdf8 100%)",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
  },

  secondaryButton: {
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "12px",
    padding: "14px 18px",
    background: "#13294d",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
  },

  emptyState: {
    fontSize: "15px",
    color: "#a9bddf",
    padding: "8px 0",
  },

  tableWrap: {
    width: "100%",
    overflowX: "auto",
  },

  tableHeader: {
    display: "grid",
    gridTemplateColumns: "1.5fr 1fr 1.2fr 1fr 1fr 1fr 1fr",
    gap: "12px",
    padding: "14px 10px",
    color: "#96afd3",
    fontSize: "14px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    fontWeight: "700",
    minWidth: "900px",
  },

  tableRow: {
    display: "grid",
    gridTemplateColumns: "1.5fr 1fr 1.2fr 1fr 1fr 1fr 1fr",
    gap: "12px",
    padding: "16px 10px",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    alignItems: "center",
    minWidth: "900px",
  },

  tableText: {
    fontSize: "14px",
    color: "#dbeafe",
  },

  tableTextStrong: {
    fontSize: "14px",
    color: "#ffffff",
    fontWeight: "700",
  },

  actionRow: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },

  editButton: {
    border: "none",
    borderRadius: "10px",
    padding: "10px 12px",
    background: "#2563eb",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
  },

  deleteButton: {
    border: "none",
    borderRadius: "10px",
    padding: "10px 12px",
    background: "#dc2626",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
  },
};

import { useMemo, useState } from "react";

export default function Relatorios({ lancamentos = [] }) {
  const [modo, setModo] = useState("mes");
  const [dataSelecionada, setDataSelecionada] = useState("");
  const [diaAberto, setDiaAberto] = useState(null);

  function formatarData(data) {
    const d = new Date(data);
    return d.toLocaleDateString("pt-BR");
  }

  function moeda(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  // Filtrar por data
  const lancamentosFiltrados = useMemo(() => {
    if (!dataSelecionada) return lancamentos;

    return lancamentos.filter((item) => {
      const data = new Date(item.created_at);
      const selecionada = new Date(dataSelecionada);

      if (modo === "dia") {
        return data.toDateString() === selecionada.toDateString();
      }

      if (modo === "mes") {
        return (
          data.getMonth() === selecionada.getMonth() &&
          data.getFullYear() === selecionada.getFullYear()
        );
      }

      return true;
    });
  }, [lancamentos, modo, dataSelecionada]);

  // Agrupar por dia
  const dias = useMemo(() => {
    const grupo = {};

    lancamentosFiltrados.forEach((item) => {
      const data = new Date(item.created_at).toDateString();

      if (!grupo[data]) {
        grupo[data] = {
          data,
          receita: 0,
          despesa: 0,
          itens: [],
        };
      }

      if (item.tipo === "receita") {
        grupo[data].receita += Number(item.valor);
      } else {
        grupo[data].despesa += Number(item.valor);
      }

      grupo[data].itens.push(item);
    });

    return Object.values(grupo).sort(
      (a, b) => new Date(b.data) - new Date(a.data)
    );
  }, [lancamentosFiltrados]);

  // Totais
  const totalReceita = dias.reduce((acc, d) => acc + d.receita, 0);
  const totalDespesa = dias.reduce((acc, d) => acc + d.despesa, 0);
  const saldo = totalReceita - totalDespesa;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Relatórios</h1>

      {/* Filtros */}
      <div style={styles.filtros}>
        <button
          style={modo === "dia" ? styles.ativo : styles.botao}
          onClick={() => setModo("dia")}
        >
          Dia
        </button>

        <button
          style={modo === "mes" ? styles.ativo : styles.botao}
          onClick={() => setModo("mes")}
        >
          Mês
        </button>

        <input
          type="date"
          style={styles.input}
          value={dataSelecionada}
          onChange={(e) => setDataSelecionada(e.target.value)}
        />
      </div>

      {/* Cards */}
      <div style={styles.cards}>
        <div style={styles.card}>
          <span>Receita</span>
          <strong>{moeda(totalReceita)}</strong>
        </div>

        <div style={styles.card}>
          <span>Despesa</span>
          <strong>{moeda(totalDespesa)}</strong>
        </div>

        <div style={styles.card}>
          <span>Saldo</span>
          <strong>{moeda(saldo)}</strong>
        </div>
      </div>

      {/* Lista de dias */}
      <div style={styles.lista}>
        {dias.map((dia) => {
          const saldoDia = dia.receita - dia.despesa;

          return (
            <div key={dia.data} style={styles.dia}>
              <div
                style={styles.headerDia}
                onClick={() =>
                  setDiaAberto(diaAberto === dia.data ? null : dia.data)
                }
              >
                <strong>{formatarData(dia.data)}</strong>
                <span>{moeda(saldoDia)}</span>
              </div>

              {diaAberto === dia.data && (
                <div style={styles.detalhes}>
                  <p>Receita: {moeda(dia.receita)}</p>
                  <p>Despesa: {moeda(dia.despesa)}</p>

                  {dia.itens.map((item) => (
                    <div key={item.id} style={styles.item}>
                      <span>{item.descricao}</span>
                      <span
                        style={{
                          color:
                            item.tipo === "receita"
                              ? "#22c55e"
                              : "#ef4444",
                        }}
                      >
                        {item.tipo === "despesa" ? "- " : "+ "}
                        {moeda(item.valor)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
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

  filtros: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },

  botao: {
    padding: "10px",
    background: "#0b1d38",
    border: "none",
    color: "#fff",
    borderRadius: "8px",
    cursor: "pointer",
  },

  ativo: {
    padding: "10px",
    background: "#2563eb",
    border: "none",
    color: "#fff",
    borderRadius: "8px",
    cursor: "pointer",
  },

  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "none",
  },

  cards: {
    display: "flex",
    gap: "15px",
    marginBottom: "20px",
  },

  card: {
    background: "#0b1d38",
    padding: "20px",
    borderRadius: "10px",
    flex: 1,
  },

  lista: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  dia: {
    background: "#0b1d38",
    borderRadius: "10px",
  },

  headerDia: {
    display: "flex",
    justifyContent: "space-between",
    padding: "15px",
    cursor: "pointer",
  },

  detalhes: {
    padding: "15px",
    borderTop: "1px solid #1e3a5f",
  },

  item: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "5px",
  },
};

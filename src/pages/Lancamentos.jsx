import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

export default function Lancamentos() {
  const [lancamentos, setLancamentos] = useState([]);

  const [tipo, setTipo] = useState("receita");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [data, setData] = useState("");
  const [recorrente, setRecorrente] = useState(false);

  const [receitas, setReceitas] = useState(0);
  const [despesas, setDespesas] = useState(0);

  // 🔥 Carregar dados
  useEffect(() => {
    carregarLancamentos();
  }, []);

  async function carregarLancamentos() {
    const { data, error } = await supabase
      .from("lancamentos")
      .select("*")
      .order("data", { ascending: false });

    if (!error) {
      setLancamentos(data);
      calcularResumo(data);
    }
  }

  function calcularResumo(lista) {
    let totalReceitas = 0;
    let totalDespesas = 0;

    lista.forEach((item) => {
      if (item.tipo === "receita") {
        totalReceitas += Number(item.valor);
      } else {
        totalDespesas += Number(item.valor);
      }
    });

    setReceitas(totalReceitas);
    setDespesas(totalDespesas);
  }

  const saldo = receitas - despesas;

  // 🚀 Salvar lançamento
  async function salvarLancamento() {
    if (!descricao || !valor || !data) {
      alert("Preencha todos os campos");
      return;
    }

    const user = await supabase.auth.getUser();

    const { error } = await supabase.from("lancamentos").insert([
      {
        tipo,
        descricao,
        valor: Number(valor),
        data,
        recorrente,
        user_id: user.data.user?.id,
      },
    ]);

    if (error) {
      alert("Erro ao salvar");
      console.log(error);
      return;
    }

    setDescricao("");
    setValor("");
    setData("");
    setRecorrente(false);

    carregarLancamentos();
  }

  // 📊 Regra 60/20/20
  const base = receitas;
  const essenciais = base * 0.6;
  const investimentos = base * 0.2;
  const lazer = base * 0.2;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Lançamentos</h1>

      {/* RESUMO */}
      <div style={styles.cards}>
        <div style={styles.cardReceita}>
          <p>Receitas</p>
          <h2>R$ {receitas.toFixed(2)}</h2>
          <span>Atualizado automaticamente</span>
        </div>

        <div style={styles.cardDespesa}>
          <p>Despesas</p>
          <h2>R$ {despesas.toFixed(2)}</h2>
          <span>Atualizado automaticamente</span>
        </div>

        <div style={styles.cardSaldo}>
          <p>Saldo</p>
          <h2>R$ {saldo.toFixed(2)}</h2>
          <span>Atualizado automaticamente</span>
        </div>
      </div>

      {/* REGRA FINANCEIRA */}
      <div style={styles.box}>
        <h3>Como usar seu dinheiro</h3>
        <p>Base de cálculo: R$ {base.toFixed(2)}</p>

        <div style={styles.linha}>
          <span>Despesas essenciais (60%)</span>
          <strong>R$ {essenciais.toFixed(2)}</strong>
        </div>

        <div style={styles.linha}>
          <span>Investimentos (20%)</span>
          <strong>R$ {investimentos.toFixed(2)}</strong>
        </div>

        <div style={styles.linha}>
          <span>Lazer / qualidade de vida (20%)</span>
          <strong>R$ {lazer.toFixed(2)}</strong>
        </div>
      </div>

      {/* FORM */}
      <div style={styles.box}>
        <h3>Novo lançamento</h3>

        <div style={styles.formGrid}>
          <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
            <option value="receita">Receita</option>
            <option value="despesa">Despesa</option>
          </select>

          <input
            placeholder="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />

          <input
            type="number"
            placeholder="Valor"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
          />

          <input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
          />

          <label>
            <input
              type="checkbox"
              checked={recorrente}
              onChange={() => setRecorrente(!recorrente)}
            />
            É recorrente?
          </label>

          <button onClick={salvarLancamento}>
            Adicionar lançamento
          </button>
        </div>
      </div>

      {/* LISTA */}
      <div style={styles.box}>
        <h3>Histórico</h3>

        {lancamentos.map((item) => (
          <div key={item.id} style={styles.item}>
            <div>
              <strong>{item.descricao}</strong>
              <p>{item.data}</p>
            </div>

            <div>
              <span
                style={{
                  color: item.tipo === "receita" ? "#00ff88" : "#ff4d4d",
                }}
              >
                R$ {Number(item.valor).toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* 🎨 ESTILO PROFISSIONAL */
const styles = {
  container: {
    padding: "20px",
    color: "#fff",
  },
  title: {
    fontSize: "28px",
    marginBottom: "20px",
  },
  cards: {
    display: "flex",
    gap: "15px",
    marginBottom: "20px",
  },
  cardReceita: {
    flex: 1,
    background: "#0f5132",
    padding: "15px",
    borderRadius: "10px",
  },
  cardDespesa: {
    flex: 1,
    background: "#5c1a1a",
    padding: "15px",
    borderRadius: "10px",
  },
  cardSaldo: {
    flex: 1,
    background: "#0b3c5d",
    padding: "15px",
    borderRadius: "10px",
  },
  box: {
    background: "#111827",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "20px",
  },
  linha: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
  },
  formGrid: {
    display: "grid",
    gap: "10px",
    marginTop: "10px",
  },
  item: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px",
    borderBottom: "1px solid #333",
  },
};

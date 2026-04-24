import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Planejamento() {
  const [idadeAtual, setIdadeAtual] = useState(25);
  const [idadeAposentadoria, setIdadeAposentadoria] = useState(50);
  const [aporte, setAporte] = useState(500);
  const [rendaDesejada, setRendaDesejada] = useState(3000);

  const [patrimonio, setPatrimonio] = useState(0);

  const taxa = 0.01; // 1% ao mês
  const inflacao = 0.005; // 0.5% ao mês

  const [dadosGrafico, setDadosGrafico] = useState([]);

  useEffect(() => {
    carregarPatrimonio();
  }, []);

  useEffect(() => {
    gerarSimulacao();
  }, [idadeAtual, idadeAposentadoria, aporte, rendaDesejada, patrimonio]);

  async function carregarPatrimonio() {
    const user = await supabase.auth.getUser();

    const { data } = await supabase
      .from("investimentos")
      .select("valor")
      .eq("user_id", user.data.user?.id);

    const total = (data || []).reduce(
      (acc, item) => acc + Number(item.valor),
      0
    );

    setPatrimonio(total);
  }

  function gerarSimulacao() {
    let lista = [];
    let saldoConsumindo = patrimonio;
    let saldoPreservando = patrimonio;
    let saldoCrescendo = patrimonio;

    let meses = (idadeAposentadoria - idadeAtual) * 12;

    for (let i = 0; i <= meses; i++) {
      let idade = idadeAtual + i / 12;

      // ANTES DA APOSENTADORIA (ACUMULAÇÃO)
      if (i < meses) {
        saldoConsumindo = saldoConsumindo * (1 + taxa) + Number(aporte);
        saldoPreservando = saldoPreservando * (1 + taxa) + Number(aporte);
        saldoCrescendo = saldoCrescendo * (1 + taxa) + Number(aporte);
      } else {
        // APOSENTADO

        // cenário 1: consumindo tudo
        saldoConsumindo =
          saldoConsumindo * (1 + taxa) - Number(rendaDesejada);

        // cenário 2: preservando
        saldoPreservando = saldoPreservando * (1 + taxa);

        // cenário 3: crescendo
        saldoCrescendo =
          saldoCrescendo * (1 + taxa) - Number(rendaDesejada) * 0.7;
      }

      lista.push({
        idade: idade.toFixed(0),
        consumindo: Math.max(0, saldoConsumindo),
        preservando: saldoPreservando,
        crescendo: saldoCrescendo,
      });
    }

    setDadosGrafico(lista);
  }

  const patrimonioNecessario = rendaDesejada / taxa;

  const falta = patrimonioNecessario - patrimonio;

  return (
    <div style={styles.container}>
      <h1>Planejamento de Aposentadoria</h1>

      {/* INPUTS */}
      <div style={styles.form}>
        <label>Idade atual</label>
        <input
          type="number"
          value={idadeAtual}
          onChange={(e) => setIdadeAtual(e.target.value)}
        />

        <label>Idade aposentadoria</label>
        <input
          type="number"
          value={idadeAposentadoria}
          onChange={(e) => setIdadeAposentadoria(e.target.value)}
        />

        <label>Aporte mensal</label>
        <input
          type="number"
          value={aporte}
          onChange={(e) => setAporte(e.target.value)}
        />

        <label>Renda desejada mensal</label>
        <input
          type="number"
          value={rendaDesejada}
          onChange={(e) => setRendaDesejada(e.target.value)}
        />
      </div>

      {/* RESULTADOS */}
      <div style={styles.box}>
        <p>Patrimônio atual: R$ {patrimonio.toFixed(2)}</p>
        <p>Necessário para renda: R$ {patrimonioNecessario.toFixed(2)}</p>
        <p>Falta acumular: R$ {falta.toFixed(2)}</p>

        {falta > 0 ? (
          <p style={{ color: "orange" }}>
            ⚠️ Você precisa aumentar seus aportes
          </p>
        ) : (
          <p style={{ color: "green" }}>
            ✅ Você já atingiu seu objetivo
          </p>
        )}
      </div>

      {/* GRÁFICO */}
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={dadosGrafico}>
            <XAxis dataKey="idade" />
            <YAxis />
            <Tooltip />

            <Line
              type="monotone"
              dataKey="consumindo"
              stroke="#ff4d4d"
              name="Consumindo"
            />

            <Line
              type="monotone"
              dataKey="preservando"
              stroke="#3399ff"
              name="Preservando"
            />

            <Line
              type="monotone"
              dataKey="crescendo"
              stroke="#00ff88"
              name="Crescendo"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ALERTA INTELIGENTE */}
      <div style={styles.box}>
        <p>
          🔴 Se gastar toda a renda → patrimônio acaba  
        </p>
        <p>
          🔵 Se preservar → mantém valor  
        </p>
        <p>
          🟢 Se reinvestir → cresce patrimônio  
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    color: "#fff",
    padding: "20px",
  },
  form: {
    display: "grid",
    gap: "10px",
    marginBottom: "20px",
  },
  box: {
    background: "#111827",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "20px",
  },
};

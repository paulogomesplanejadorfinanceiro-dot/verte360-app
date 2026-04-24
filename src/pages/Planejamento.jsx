import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function Planejamento() {
  const [idadeAtual, setIdadeAtual] = useState(25);
  const [idadeAposentar, setIdadeAposentar] = useState(50);
  const [aporteMensal, setAporteMensal] = useState(500);
  const [rendaDesejada, setRendaDesejada] = useState(3000);

  const [patrimonio, setPatrimonio] = useState(0);
  const [dadosGrafico, setDadosGrafico] = useState([]);
  const [mensagem, setMensagem] = useState("");

  // 🔥 PUXA PATRIMÔNIO DOS INVESTIMENTOS
  useEffect(() => {
    async function buscarInvestimentos() {
      const { data } = await supabase
        .from("investimentos")
        .select("valor");

      if (data) {
        const total = data.reduce((acc, item) => acc + Number(item.valor), 0);
        setPatrimonio(total);
      }
    }

    buscarInvestimentos();
  }, []);

  // 🔥 CALCULA PROJEÇÃO
  useEffect(() => {
    const anos = idadeAposentar - idadeAtual;
    const taxa = 0.01; // 1% ao mês

    let montante = patrimonio;
    let dados = [];

    for (let i = 0; i <= anos; i++) {
      for (let m = 0; m < 12; m++) {
        montante = montante * (1 + taxa) + Number(aporteMensal);
      }

      dados.push({
        idade: idadeAtual + i,
        valor: Math.round(montante)
      });
    }

    setDadosGrafico(dados);

    // 🔥 REGRA DE ALERTA
    if (aporteMensal < rendaDesejada * 0.2) {
      setMensagem("⚠️ Você está investindo pouco. Seu dinheiro pode não durar.");
    } else {
      setMensagem("✅ Você está no caminho certo para sua aposentadoria.");
    }

  }, [idadeAtual, idadeAposentar, aporteMensal, patrimonio]);

  return (
    <div style={{ padding: 20 }}>
      <h2>Planejamento de Aposentadoria</h2>

      {/* INPUTS */}
      <div style={{ display: "grid", gap: 10, marginBottom: 20 }}>
        <input
          type="number"
          placeholder="Idade atual"
          value={idadeAtual}
          onChange={(e) => setIdadeAtual(Number(e.target.value))}
        />

        <input
          type="number"
          placeholder="Idade para aposentar"
          value={idadeAposentar}
          onChange={(e) => setIdadeAposentar(Number(e.target.value))}
        />

        <input
          type="number"
          placeholder="Aporte mensal"
          value={aporteMensal}
          onChange={(e) => setAporteMensal(Number(e.target.value))}
        />

        <input
          type="number"
          placeholder="Renda desejada na aposentadoria"
          value={rendaDesejada}
          onChange={(e) => setRendaDesejada(Number(e.target.value))}
        />
      </div>

      {/* PATRIMÔNIO */}
      <div style={{ marginBottom: 20 }}>
        <strong>Patrimônio atual:</strong> R$ {patrimonio}
      </div>

      {/* ALERTA */}
      <div style={{ marginBottom: 20 }}>
        {mensagem}
      </div>

      {/* GRÁFICO */}
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={dadosGrafico}>
            <XAxis dataKey="idade" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="valor" stroke="#00ff88" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

export default function Investimentos() {
  const [lista, setLista] = useState([]);
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("CDB");
  const [instituicao, setInstituicao] = useState("");
  const [valor, setValor] = useState("");

  const [patrimonio, setPatrimonio] = useState(0);

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    const user = await supabase.auth.getUser();

    const { data } = await supabase
      .from("investimentos")
      .select("*")
      .eq("user_id", user.data.user?.id);

    setLista(data || []);

    const total = (data || []).reduce(
      (acc, item) => acc + Number(item.valor),
      0
    );

    setPatrimonio(total);
  }

  async function adicionar() {
    const user = await supabase.auth.getUser();

    await supabase.from("investimentos").insert([
      {
        nome,
        tipo,
        instituicao,
        valor: Number(valor),
        user_id: user.data.user?.id,
      },
    ]);

    setNome("");
    setInstituicao("");
    setValor("");

    carregar();
  }

  return (
    <div style={{ color: "#fff" }}>
      <h1>Investimentos</h1>

      <h2>Patrimônio total: R$ {patrimonio.toFixed(2)}</h2>

      <div>
        <input
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

        <select onChange={(e) => setTipo(e.target.value)}>
          <option>CDB</option>
          <option>Tesouro</option>
          <option>Reserva</option>
        </select>

        <input
          placeholder="Instituição"
          value={instituicao}
          onChange={(e) => setInstituicao(e.target.value)}
        />

        <input
          type="number"
          placeholder="Valor"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
        />

        <button onClick={adicionar}>Adicionar</button>
      </div>

      {lista.map((item) => (
        <div key={item.id}>
          <p>{item.nome}</p>
          <p>R$ {item.valor}</p>
        </div>
      ))}
    </div>
  );
}

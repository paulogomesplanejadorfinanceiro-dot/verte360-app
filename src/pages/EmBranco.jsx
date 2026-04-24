import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function Investimentos() {
  const [nome, setNome] = useState("");
  const [valor, setValor] = useState("");
  const [lista, setLista] = useState([]);

  async function salvar() {
    await supabase.from("investimentos").insert([
      { nome, valor }
    ]);

    setNome("");
    setValor("");
    carregar();
  }

  async function carregar() {
    const { data } = await supabase.from("investimentos").select("*");
    setLista(data || []);
  }

  useEffect(() => {
    carregar();
  }, []);

  const total = lista.reduce((acc, i) => acc + Number(i.valor), 0);

  return (
    <div>
      <h2>Investimentos</h2>

      <p>Patrimônio total: R$ {total}</p>

      <input placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} />
      <input placeholder="Valor" value={valor} onChange={e => setValor(e.target.value)} />

      <button onClick={salvar}>Adicionar</button>

      {lista.map(i => (
        <div key={i.id}>
          {i.nome} - R$ {i.valor}
        </div>
      ))}
    </div>
  );
}

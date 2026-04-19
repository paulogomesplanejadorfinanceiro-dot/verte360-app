import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://pnurseudpiyyosulmwrf.supabase.co",
  "sb_publishable_YaOLy2InC7wJuVNjqvg8Lw_3pRLwnAY"
);
export default function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
    });
  }, []);

  async function login() {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (error) {
      alert("Erro no login");
    } else {
      setUser(data.user);
    }
  }

  async function cadastrar() {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: senha,
    });

    if (error) {
      alert("Erro no cadastro");
    } else {
      alert("Cadastro realizado!");
    }
  }

  async function sair() {
    await supabase.auth.signOut();
    setUser(null);
  }

  if (!user) {
    return (
      <div style={{ padding: 40 }}>
        <h1>Vertex360</h1>

        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <br /><br />

        <input
          placeholder="Senha"
          type="password"
          onChange={(e) => setSenha(e.target.value)}
        />
        <br /><br />

        <button onClick={login}>Entrar</button>
        <button onClick={cadastrar}>Cadastrar</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Bem-vindo ao Vertex360</h1>
      <p>Usuário logado: {user.email}</p>

      <button onClick={sair}>Sair</button>
    </div>
  );
}

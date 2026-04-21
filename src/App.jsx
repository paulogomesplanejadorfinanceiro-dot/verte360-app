import { useEffect, useState } from "react";
import { supabase } from "./services/supabase.js";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  }

  if (!user) {
    return (
      <div style={{ padding: 40 }}>
        <h1>TESTE LOGIN GOOGLE</h1>
        <button onClick={handleLogin}>Entrar com Google</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>LOGADO COM SUCESSO</h1>
      <p>{user.email}</p>
    </div>
  );
}

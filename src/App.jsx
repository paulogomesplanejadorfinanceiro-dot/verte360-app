async function handleLogin() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: "https://app.vertex360planejamento.com.br",
    },
  })

  if (error) {
    alert("Erro ao entrar com Google: " + error.message)
    console.log(error)
  }
}

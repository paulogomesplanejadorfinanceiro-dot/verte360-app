import { useState } from "react";

export default function EducacaoFinanceira() {
  const [aba, setAba] = useState("dica");

  const dicas = [
    "Se você ganha R$100 e gasta R$100, você está preso. Comece guardando R$5.",
    "Quem controla o dinheiro, controla a vida.",
    "Não é quanto você ganha, é quanto você guarda.",
    "Se sobrar dinheiro no final do mês, você fez certo.",
    "Antes de investir, organize sua vida financeira."
  ];

  const desafios = [
    "Hoje você vai anotar TODOS os gastos.",
    "Hoje você não vai gastar com nada desnecessário.",
    "Hoje você vai guardar pelo menos R$2.",
    "Hoje você vai evitar comprar comida fora.",
    "Hoje você vai revisar seus gastos da semana."
  ];

  const aulas = [
    { titulo: "Como sair do zero", nivel: "Iniciante" },
    { titulo: "Como guardar dinheiro ganhando pouco", nivel: "Iniciante" },
    { titulo: "Primeiro investimento (CDB)", nivel: "Iniciante" },
    { titulo: "Como montar sua reserva", nivel: "Essencial" }
  ];

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Educação Financeira</h2>

      {/* MENU */}
      <div style={styles.menu}>
        <button onClick={() => setAba("dica")} style={styles.button}>Dica do dia</button>
        <button onClick={() => setAba("desafio")} style={styles.button}>Desafio</button>
        <button onClick={() => setAba("aulas")} style={styles.button}>Aulas</button>
      </div>

      {/* CONTEÚDO */}
      {aba === "dica" && (
        <div style={styles.card}>
          <h3>💡 Dica do dia</h3>
          <p>{dicas[Math.floor(Math.random() * dicas.length)]}</p>
        </div>
      )}

      {aba === "desafio" && (
        <div style={styles.card}>
          <h3>🔥 Desafio de hoje</h3>
          <p>{desafios[Math.floor(Math.random() * desafios.length)]}</p>
          <button style={styles.greenButton}>Marcar como feito</button>
        </div>
      )}

      {aba === "aulas" && (
        <div style={styles.card}>
          <h3>📚 Aulas disponíveis</h3>

          {aulas.map((aula, i) => (
            <div key={i} style={styles.aula}>
              <div>
                <strong>{aula.titulo}</strong>
                <p style={{ fontSize: 12 }}>{aula.nivel}</p>
              </div>
              <button style={styles.blueButton}>Ver</button>
            </div>
          ))}
        </div>
      )}

      {/* BLOQUEIO PREMIUM */}
      <div style={styles.premium}>
        <p>🔒 Conteúdo completo disponível no plano Premium</p>
        <button style={styles.purpleButton}>Assinar por R$19/mês</button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: 20,
    color: "#fff",
  },

  title: {
    marginBottom: 20,
  },

  menu: {
    display: "flex",
    gap: 10,
    marginBottom: 20,
  },

  button: {
    padding: "10px 15px",
    background: "#1e293b",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },

  card: {
    background: "#1e293b",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },

  aula: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    padding: 10,
    background: "#0f172a",
    borderRadius: 8,
  },

  greenButton: {
    marginTop: 10,
    background: "#22c55e",
    border: "none",
    padding: 10,
    borderRadius: 8,
    color: "#fff",
    cursor: "pointer",
  },

  blueButton: {
    background: "#3b82f6",
    border: "none",
    padding: 8,
    borderRadius: 6,
    color: "#fff",
    cursor: "pointer",
  },

  purpleButton: {
    marginTop: 10,
    background: "#9333ea",
    border: "none",
    padding: 10,
    borderRadius: 8,
    color: "#fff",
    cursor: "pointer",
  },

  premium: {
    marginTop: 30,
    padding: 15,
    background: "#1e293b",
    borderRadius: 10,
    textAlign: "center",
  },
};

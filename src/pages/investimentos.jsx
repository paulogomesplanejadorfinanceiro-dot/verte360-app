import { useState } from "react";

export default function Investimentos() {
  return (
    <div style={styles.container}>
      
      {/* TOPO */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Investimentos</h1>
          <p style={styles.subtitle}>
            Acompanhe e gerencie todos os seus investimentos em um só lugar.
          </p>
        </div>

        <button style={styles.button}>
          + Adicionar investimento
        </button>
      </div>

      {/* CARDS */}
      <div style={styles.cards}>

        <div style={styles.card}>
          <span>💰 Patrimônio total</span>
          <h2>R$ 0,00</h2>
        </div>

        <div style={styles.card}>
          <span>📊 Total investido</span>
          <h2>R$ 0,00</h2>
        </div>

        <div style={styles.card}>
          <span>📈 Rentabilidade no mês</span>
          <h2>R$ 0,00</h2>
        </div>

        <div style={styles.card}>
          <span>🏆 Rentabilidade total</span>
          <h2>R$ 0,00</h2>
        </div>

      </div>

    </div>
  );
}

const styles = {
  container: {
    padding: "30px",
    color: "#fff",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  title: {
    margin: 0,
  },

  subtitle: {
    color: "#aaa",
    fontSize: "14px",
  },

  button: {
    background: "#7c3aed",
    border: "none",
    padding: "10px 15px",
    borderRadius: "10px",
    color: "#fff",
    cursor: "pointer",
  },

  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "15px",
  },

  card: {
    background: "#111827",
    padding: "20px",
    borderRadius: "12px",
  },
};

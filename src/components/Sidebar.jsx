export default function Sidebar({ setPage }) {
  return (
    <div style={{ width: 200, background: "#111", color: "#fff", padding: 20 }}>
      <h3>Vertex360</h3>

      <p onClick={() => setPage("dashboard")}>Dashboard</p>
      <p onClick={() => setPage("lancamentos")}>Lançamentos</p>
      <p onClick={() => setPage("relatorios")}>Relatórios</p>
      <p onClick={() => setPage("metas")}>Metas</p>
      <p onClick={() => setPage("investimentos")}>Investimentos</p>
      <p onClick={() => setPage("planejamento")}>Planejamento</p>
    </div>
  );
}

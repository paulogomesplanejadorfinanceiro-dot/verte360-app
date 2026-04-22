export default function Investimentos({
  investimentos = [],
  onAdd,
  onRemove,
}) {
  const totalInvestido = investimentos.reduce(
    (acc, i) => acc + Number(i.valorAplicado || 0), 0
  );
  const patrimonioTotal = investimentos.reduce(
    (acc, i) => acc + Number(i.valorAtual || 0), 0
  );
  const rentabilidadeTotal = patrimonioTotal - totalInvestido;
  const rentabilidadeMes = 0;

  const iconStyle = (bg) => ({
    width: "46px", height: "46px", borderRadius: "12px",
    background: bg, display: "flex", alignItems: "center",
    justifyContent: "center", fontSize: "20px", flexShrink: 0,
  });

  const fmt = (v) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Investimentos</h1>
          <p style={styles.subtitle}>
            Acompanhe e gerencie todos os seus investimentos em um só lugar.
          </p>
        </div>
        <button style={styles.addButton} onClick={onAdd}>
          + Adicionar investimento
        </button>
      </div>

      <div style={styles.cards}>
        {[
          { icon: "💰", bg: "#16a34a", label: "Patrimônio total", valor: patrimonioTotal, info: "Atualizado automaticamente", cor: "#22c55e" },
          { icon: "📊", bg: "#2563eb", label: "Total investido", valor: totalInvestido, info: "Atualizado automaticamente", cor: "#60a5fa" },
          { icon: "📈", bg: "#7c3aed", label: "Rentabilidade no mês", valor: rentabilidadeMes, info: "Atualizado automaticamente", cor: "#c084fc" },
          { icon: "🏆", bg: "#f59e0b", label: "Rentabilidade total", valor: rentabilidadeTotal, info: "Atualizado automaticamente", cor: "#fbbf24" },
        ].map((card) => (
          <div style={styles.card} key={card.label}>
            <div style={iconStyle(card.bg)}>{card.icon}</div>
            <div>
              <div style={styles.cardLabel}>{card.label}</div>
              <div style={styles.cardValue}>{fmt(card.valor)}</div>
              <div style={{ marginTop: "8px", fontSize: "13px", color: card.cor }}>
                {card.info}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.gridTop}>
        <div style={styles.panel}>
          <div style={styles.panelTitle}>Distribuição do patrimônio</div>
          <div style={styles.placeholderCircleWrap}>
            <div style={styles.placeholderCircle}>
              <div style={styles.placeholderCircleCenter}>
                <div style={styles.placeholderCircleText}>Total</div>
                <div style={styles.placeholderCircleValue}>{fmt(patrimonioTotal)}</div>
              </div>
            </div>
          </div>
        </div>

        <div style={styles.panel}>
          <div style={styles.panelHeader}>
            <div style={styles.panelTitle}>Evolução do patrimônio</div>
            <div style={styles.selectFake}>Este ano ▾</div>
          </div>
          <div style={styles.chartPlaceholder}>
            <div style={styles.chartLine1}></div>
            <div style={styles.chartLine2}></div>
            <div style={styles.chartLine3}></div>
          </div>
        </div>
      </div>

      <div style={styles.tablePanel}>
        <div style={styles.panelHeader}>
          <div style={styles.panelTitle}>Meus investimentos</div>
          <div style={styles.tableFilters}>
            <div style={styles.filterFake}>Todos os tipos ▾</div>
            <div style={styles.filterFake}>Ordenar por: Tipo ▾</div>
          </div>
        </div>

        <div style={styles.tableHeader}>
          <div>Tipo de investimento</div>
          <div>Instituição / Corretora</div>
          <div>Valor aplicado</div>
          <div>Valor atual</div>
          <div>Rentabilidade</div>
          <div>% da carteira</div>
          <div>Ações</div>
        </div>

        {investimentos.length === 0 ? (
          <div style={styles.emptyRow}>Nenhum investimento cadastrado ainda.</div>
        ) : (
          investimentos.map((inv) => {
            const rent = Number(inv.valorAtual || 0) - Number(inv.valorAplicado || 0);
            const pct = patrimonioTotal > 0
              ? ((Number(inv.valorAtual || 0) / patrimonioTotal) * 100).toFixed(1)
              : "0.0";
            return (
              <div style={styles.tableRow} key={inv.id}>
                <div>{inv.tipo}</div>
                <div>{inv.instituicao}</div>
                <div>{fmt(Number(inv.valorAplicado || 0))}</div>
                <div>{fmt(Number(inv.valorAtual || 0))}</div>
                <div style={{ color: rent >= 0 ? "#22c55e" : "#ef4444" }}>
                  {fmt(rent)}
                </div>
                <div>{pct}%</div>
                <div>
                  <button
                    style={styles.removeBtn}
                    onClick={() => onRemove(inv.id)}
                  >
                    Remover
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div style={styles.gridBottom}>
        <div style={styles.panel}>
          <div style={styles.panelTitle}>Alocação ideal x Atual</div>
          {[
            { label: "Renda Fixa", pct: 40 },
            { label: "Renda Variável", pct: 25 },
            { label: "Fundos Imobiliários", pct: 18 },
            { label: "Reserva", pct: 12 },
            { label: "Cripto", pct: 8 },
          ].map((item) => (
            <div style={styles.allocRow} key={item.label}>
              <span>{item.label}</span>
              <div style={styles.barTrack}>
                <div style={{ ...styles.barFill, width: `${item.pct}%` }}></div>
              </div>
              <span>0%</span>
            </div>
          ))}
          <div style={styles.tipBox}>
            {investimentos.length === 0
              ? "Sua carteira ainda está vazia. Cadastre investimentos para ver sua distribuição."
              : "Distribuição baseada nos seus investimentos cadastrados."}
          </div>
        </div>

        <div style={styles.panel}>
          <div style={styles.panelTitle}>Indicadores de performance</div>
          {[
            { label: "Retorno médio mensal", valor: "0,0%" },
            { label: "Retorno médio anual", valor: "0,0%" },
            { label: "Melhor investimento", valor: "-" },
            { label: "Pior investimento", valor: "-" },
            { label: "Índice de Sharpe", valor: "0,00" },
            { label: "Volatilidade da carteira", valor: "Baixa" },
          ].map((row) => (
            <div style={styles.infoRow} key={row.label}>
              <span>{row.label}</span>
              <strong>{row.valor}</strong>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.recomendacoesPanel}>
        <div style={styles.panelTitle}>Recomendações para você</div>
        <div style={styles.recomendacoesGrid}>
          {[
            { titulo: "Aumente sua reserva", texto: "Crie sua base de segurança antes de aumentar risco." },
            { titulo: "Diversifique mais", texto: "Distribua melhor entre categorias diferentes." },
            { titulo: "Aporte consistente", texto: "Manter aportes mensais melhora o crescimento no longo prazo." },
            { titulo: "Estude mais", texto: "Aprenda antes de investir em ativos mais voláteis." },
          ].map((rec) => (
            <div style={styles.recomendacaoCard} key={rec.titulo}>
              <div style={styles.recomendacaoTitle}>{rec.titulo}</div>
              <div style={styles.recomendacaoText}>{rec.texto}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const GRID_COLS = "2fr 1.6fr 1.2fr 1.2fr 1.2fr 1fr 0.8fr";

const styles = {
  container: { width: "100%", padding: "30px", color: "#ffffff", background: "#07152d", minHeight: "100vh", boxSizing: "border-box" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "20px", marginBottom: "24px" },
  title: { margin: 0, fontSize: "42px", fontWeight: "800" },
  subtitle: { marginTop: "6px", color: "#9fb2d1", fontSize: "15px" },
  addButton: { background: "linear-gradient(90deg, #7c3aed 0%, #9333ea 100%)", border: "none", padding: "14px 18px", borderRadius: "12px", color: "#fff", cursor: "pointer", fontWeight: "700", fontSize: "14px", whiteSpace: "nowrap" },
  cards: { display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "16px", marginBottom: "20px" },
  card: { background: "#0c1f3d", border: "1px solid rgba(255,255,255,0.06)", padding: "20px", borderRadius: "16px", display: "flex", alignItems: "flex-start", gap: "14px" },
  cardLabel: { fontSize: "14px", color: "#dce8ff", marginBottom: "8px" },
  cardValue: { margin: 0, fontSize: "28px", fontWeight: "800" },
  gridTop: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px", marginBottom: "20px" },
  gridBottom: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px", marginBottom: "20px" },
  panel: { background: "#0b1d38", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", padding: "20px", minHeight: "260px" },
  panelHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", marginBottom: "16px" },
  panelTitle: { margin: 0, fontSize: "18px", fontWeight: "700" },
  selectFake: { padding: "10px 14px", borderRadius: "10px", background: "#10284d", color: "#dce8ff", fontSize: "14px" },
  placeholderCircleWrap: { display: "flex", justifyContent: "center", alignItems: "center", height: "210px" },
  placeholderCircle: { width: "220px", height: "220px", borderRadius: "50%", background: "conic-gradient(#2563eb 0% 30%, #16a34a 30% 55%, #7c3aed 55% 72%, #f59e0b 72% 88%, #64748b 88% 100%)", display: "flex", alignItems: "center", justifyContent: "center" },
  placeholderCircleCenter: { width: "110px", height: "110px", borderRadius: "50%", background: "#0b1d38", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" },
  placeholderCircleText: { fontSize: "13px", color: "#9fb2d1" },
  placeholderCircleValue: { fontSize: "16px", fontWeight: "700" },
  chartPlaceholder: { marginTop: "20px", height: "220px", borderRadius: "16px", background: "linear-gradient(180deg, #0f274b 0%, #0a1f3d 100%)", position: "relative", overflow: "hidden" },
  chartLine1: { position: "absolute", left: "20px", right: "20px", top: "65%", height: "3px", background: "#22c55e", transform: "rotate(-7deg)", borderRadius: "999px" },
  chartLine2: { position: "absolute", left: "20px", right: "20px", top: "48%", height: "3px", background: "#fb7185", transform: "rotate(6deg)", borderRadius: "999px" },
  chartLine3: { position: "absolute", left: "20px", right: "20px", top: "35%", height: "3px", background: "#60a5fa", transform: "rotate(-6deg)", borderRadius: "999px" },
  tablePanel: { background: "#0b1d38", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", padding: "20px", marginBottom: "20px" },
  tableFilters: { display: "flex", gap: "10px", flexWrap: "wrap" },
  filterFake: { padding: "10px 14px", borderRadius: "10px", background: "#10284d", color: "#dce8ff", fontSize: "14px" },
  tableHeader: { display: "grid", gridTemplateColumns: GRID_COLS, gap: "12px", color: "#8ea7cf", fontSize: "13px", padding: "16px 0", borderBottom: "1px solid rgba(255,255,255,0.08)", marginTop: "8px" },
  tableRow: { display: "grid", gridTemplateColumns: GRID_COLS, gap: "12px", color: "#dce8ff", fontSize: "14px", padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", alignItems: "center" },
  emptyRow: { padding: "20px 0 6px", color: "#9fb2d1", fontSize: "15px" },
  removeBtn: { background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171", borderRadius: "8px", padding: "6px 10px", cursor: "pointer", fontSize: "12px", fontWeight: "600" },
  allocRow: { display: "grid", gridTemplateColumns: "140px 1fr 50px", alignItems: "center", gap: "10px", marginBottom: "14px", color: "#dce8ff", fontSize: "14px" },
  barTrack: { width: "100%", height: "10px", background: "#11294c", borderRadius: "999px", overflow: "hidden" },
  barFill: { height: "100%", background: "linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)", borderRadius: "999px" },
  tipBox: { marginTop: "20px", background: "rgba(124,58,237,0.15)", border: "1px solid rgba(192,132,252,0.2)", borderRadius: "12px", padding: "14px", color: "#d8c7ff", fontSize: "14px" },
  infoRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.08)", color: "#dce8ff", fontSize: "15px" },
  recomendacoesPanel: { background: "#0b1d38", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", padding: "20px" },
  recomendacoesGrid: { display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "14px", marginTop: "18px" },
  recomendacaoCard: { background: "#0f223f", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "14px", padding: "18px" },
  recomendacaoTitle: { fontSize: "16px", fontWeight: "700", marginBottom: "8px" },
  recomendacaoText: { fontSize: "14px", color: "#9fb2d1", lineHeight: 1.5 },
};

const WHATSAPP_NUMBER = "5511987835736";

export default function DashboardSupport({ user }) {
  function openWhatsApp() {
    const text = encodeURIComponent(
      `Olá, vim pelo app Vertex360 e quero falar com meu planejador financeiro.`
    );

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank");
  }

  function scheduleQuickMeeting() {
    const text = encodeURIComponent(
      `Olá, Paulo. Vim pelo app Vertex360 e quero agendar uma reunião.%0A%0ACliente: ${
        user?.email || "-"
      }`
    );

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank");
  }

  return (
    <div className="dashboard-support">
      <div className="dashboard-support__card dashboard-support__card--highlight">
        <div>
          <div className="dashboard-support__title">Precisa de ajuda?</div>
          <div className="dashboard-support__text">
            Fale direto com seu planejador financeiro.
          </div>
        </div>

        <button className="btn btn--primary" onClick={openWhatsApp}>
          💬 Falar no WhatsApp
        </button>
      </div>

      <div className="dashboard-support__card">
        <div>
          <div className="dashboard-support__title">Quer uma análise?</div>
          <div className="dashboard-support__text">
            Agende uma reunião rápida direto pelo app.
          </div>
        </div>

        <button className="btn btn--ghost" onClick={scheduleQuickMeeting}>
          📅 Agendar reunião
        </button>
      </div>
    </div>
  );
}

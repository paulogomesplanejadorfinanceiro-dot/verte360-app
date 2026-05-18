import { useState } from "react";
import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Lancamentos from "./pages/Lancamentos";
import Metas from "./pages/Metas";
import Planejamento from "./pages/Planejamento";
import Relatorios from "./pages/Relatorios";
import EducacaoFinanceira from "./pages/EducacaoFinanceira";
import EmBranco from "./pages/EmBranco";

export default function App() {
  const [pagina, setPagina] = useState("dashboard");

  function renderPagina() {
    switch (pagina) {
      case "dashboard":
        return <Dashboard />;
      case "lancamentos":
        return <Lancamentos />;
      case "metas":
        return <Metas />;
      case "planejamento":
        return <Planejamento />;
      case "relatorios":
        return <Relatorios />;
      case "educacao":
        return <EducacaoFinanceira />;
      case "investimentos":
        return <EmBranco />;
      default:
        return <Dashboard />;
    }
  }

  return (
    <div>
      {/* CSS embutido para criar as regras de celular vs computador de forma simples */}
      <style>{`
        .app-container {
          display: flex;
          min-height: 100vh;
          background-color: #0b132b; /* Cor de fundo escura padrão */
          color: #ffffff;
        }

        .main-content {
          flex: 1;
          padding: 20px;
          /* Deixa um espaço no fim da página no celular para o menu inferior não tampar nada */
          padding-bottom: 90px; 
        }

        /* BARRA INFERIOR (Mobile) */
        .bottom-nav {
          display: none;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 65px;
          background-color: #111c40;
          border-t: 1px solid #1c2d66;
          justify-content: space-around;
          align-items: center;
          z-index: 100;
        }

        .bottom-nav-btn {
          background: none;
          border: none;
          color: #a0aec0;
          font-size: 11px;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .bottom-nav-btn.active {
          color: #00b4d8;
          font-weight: bold;
        }

        /* BOTÃO FLUTUANTE DE MAIS (+) */
        .fab-btn {
          display: none;
          position: fixed;
          bottom: 80px;
          right: 20px;
          width: 56px;
          height: 56px;
          background: linear-gradient(to top right, #0077b6, #00b4d8);
          border: none;
          border-radius: 50%;
          color: white;
          font-size: 28px;
          font-weight: bold;
          justify-content: center;
          align-items: center;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
          cursor: pointer;
          z-index: 99;
        }

        /* REGRAS PARA CELULAR (Telas menores que 768px) */
        @media (max-width: 768px) {
          .sidebar-desktop {
            display: none; /* Esconde a sidebar antiga na esquerda */
          }
          .bottom-nav {
            display: flex; /* Mostra o menu de baixo */
          }
          .fab-btn {
            display: flex; /* Mostra o botão flutuante de + */
          }
          .main-content {
            padding: 15px;
            padding-bottom: 90px;
          }
        }
      `}</style>

      <div className="app-container">
        {/* Sidebar original protegida dentro de uma div que some no celular */}
        <div className="sidebar-desktop">
          <Sidebar setPage={setPagina} currentPage={pagina} />
        </div>

        {/* Conteúdo da página atual */}
        <div className="main-content">
          {renderPagina()}
        </div>

        {/* BOTÃO FLUTUANTE DE (+) - Joga o usuário direto para Lançamentos */}
        <button className="fab-btn" onClick={() => setPagina("lancamentos")}>
          +
        </button>

        {/* BARRA DE NAVEGAÇÃO INFERIOR PARA CELULAR */}
        <nav className="bottom-nav">
          <button 
            className={`bottom-nav-btn ${pagina === "dashboard" ? "active" : ""}`}
            onClick={() => setPagina("dashboard")}
          >
            🏠 <span style={{ marginTop: 2 }}>Início</span>
          </button>
          
          <button 
            className={`bottom-nav-btn ${pagina === "lancamentos" ? "active" : ""}`}
            onClick={() => setPagina("lancamentos")}
          >
            💰 <span>Lançar</span>
          </button>

          <button 
            className={`bottom-nav-btn ${pagina === "metas" ? "active" : ""}`}
            onClick={() => setPagina("metas")}
          >
            🎯 <span>Metas</span>
          </button>

          <button 
            className={`bottom-nav-btn ${pagina === "planejamento" ? "active" : ""}`}
            onClick={() => setPagina("planejamento")}
          >
            📊 <span>Planos</span>
          </button>

          <button 
            className={`bottom-nav-btn ${pagina === "educacao" ? "active" : ""}`}
            onClick={() => setPagina("educacao")}
          >
            👑 <span style={{ color: "#9d4edd" }}>Premium</span>
          </button>
        </nav>
      </div>
    </div>
  );
}

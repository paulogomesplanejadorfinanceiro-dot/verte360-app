import Dashboard from "./pages/Dashboard";
import Sidebar from "./components/Sidebar";
import "./app.css";

export default function App() {
  return (
    <div style={styles.container}>
      <Sidebar />

      <div style={styles.content}>
        <Dashboard />
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
  },

  content: {
    flex: 1,
  },
};

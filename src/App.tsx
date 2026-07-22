import Sidebar from "./components/layout/Sidebar";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <div className="app-shell">
      <Sidebar />

      <main className="main-content">
        <Dashboard />
      </main>
    </div>
  );
}

export default App;
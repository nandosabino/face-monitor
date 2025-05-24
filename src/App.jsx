import "./App.css";

import Dashboard from "./components/Dashboard";
import LiveVideoCard from "./components/LiveVideoCard";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">
        Monitoramento Facial em Tempo Real
      </h1>
      <LiveVideoCard />
      <Dashboard />
    </div>
  );
}

export default App;

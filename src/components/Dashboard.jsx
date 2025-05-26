import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useDashboardData } from "../hooks/useDashboardData";

export default function Dashboard() {
  const detections = useDashboardData();
  const totalPessoas = detections.length;

  const tempoMedio = (() => {
    if (detections.length < 2) return "–";
    const tempos = [];
    for (let i = 1; i < detections.length; i++) {
      const t1 = detections[i].timestamp?.getTime?.() || 0;
      const t0 = detections[i - 1].timestamp?.getTime?.() || 0;
      if (t1 && t0 && t1 > t0) {
        tempos.push((t1 - t0) / 1000);
      }
    }
    if (tempos.length === 0) return "–";
    const media = tempos.reduce((a, b) => a + b, 0) / tempos.length;
    const minutos = Math.floor(media / 60);
    const segundos = Math.floor(media % 60);
    return `${minutos}min ${segundos}s`;
  })();

  const fluxoPorHoraMap = detections.reduce((acc, det) => {
    if (!det.timestamp) return acc;
    const hora = new Date(det.timestamp).getHours();
    const label = `${hora.toString().padStart(2, "0")}h`;
    acc[label] = (acc[label] || 0) + 1;
    return acc;
  }, {});

  const fluxoPorHora = Object.entries(fluxoPorHoraMap).map(([hora, count]) => ({
    hora,
    count,
  }));

  const pico = fluxoPorHora.length
    ? fluxoPorHora.reduce(
        (max, item) => (item.count > max.count ? item : max),
        { hora: "–", count: 0 }
      )
    : { hora: "–", count: 0 };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-center">📊 Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-3 text-center">
        <div className="bg-white p-4 rounded shadow border">
          <h2 className="text-sm text-gray-500">Pessoas Detectadas</h2>
          <div className="text-2xl font-bold">{totalPessoas}</div>
        </div>
        <div className="bg-white p-4 rounded shadow border">
          <h2 className="text-sm text-gray-500">Tempo Médio</h2>
          <div className="text-2xl font-bold">{tempoMedio}</div>
        </div>
        <div className="bg-white p-4 rounded shadow border">
          <h2 className="text-sm text-gray-500">Pico de Fluxo</h2>
          <div className="text-2xl font-bold">
            {pico.hora} ({pico.count})
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow border">
        <h3 className="text-lg font-semibold mb-4">Fluxo por Hora</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={fluxoPorHora}>
              <XAxis dataKey="hora" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

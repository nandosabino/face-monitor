import { useDetections } from "../hooks/useDetections";

export default function Dashboard() {
    const detections = useDetections()
    const totalPessoas = detections.length
    const tempoMedio = "2min 30s"

    const fluxoPorHora = detections.reduce((acc, det) => {
        const hora = new Date(det.timestamp?.seconds * 1000).getHours()
        const label = `${hora}h`
        acc[label] = (acc[label] || 0) + 1
        return acc
    }, [])

    const pico = Object.entries(fluxoPorHora).reduce((max, [hora, count]) =>
    count > max.count ? { hora, count } : max,
    { hora: "N/A", count: 0 }
)

return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-center">Dashboard</h1>

        <div className="grid gap-4 md:grid-cols-3">
            <div className="bg-white p-4 rounded shadow border">
                <h2 className="text-sm font-semibold">Pessoas Detectadas</h2>
                <div className="text-2xl font-bold">{totalPessoas}</div>
            </div>
            <div className="bg-white p-4 rounded shadow border">
                <h2 className="text-sm font-semibold">Tempo Médio</h2>
                <div className="text-2xl font-bold">{tempoMedio}</div>
            </div>
            <div className="bg-white p-4 rounded shadow border">
                <h2 className="text-sm font-semibold">Pico de Fluxo</h2>
                <div className="text-2xl font-bold">{pico.hora} ({pico.count})</div>
            </div>
        </div>
    </div>
)
}
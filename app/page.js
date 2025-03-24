import Link from "next/link";

export default function Home() {
  // List of available sensors
  const sensors = [0, 1, 2];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Sensor Dashboard</h1>
      <p className="mb-4 text-lg">Select a sensor to view its graph:</p>

      <div className="flex flex-wrap justify-center gap-4">
        {sensors.map((sensorId) => (
          <Link key={sensorId} href={`/senzor/${sensorId}`} passHref>
            <div className="cursor-pointer px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-lg transition">
              Sensor {sensorId}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

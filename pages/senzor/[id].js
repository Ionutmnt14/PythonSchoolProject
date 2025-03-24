import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function SenzorPage() {
  const router = useRouter();
  const { id } = router.query;
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const response = await fetch(`/api/senzor?id=${id}`);
        const data = await response.json();
        setImageSrc(data.plot_url);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!imageSrc) return <p>Error loading image</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-2xl font-bold mb-4">Sensor {id} Graph</h1>
      <img
        src={imageSrc}
        alt={`Sensor ${id} Graph`}
        className="border border-white rounded-lg shadow-lg"
      />
    </div>
  );
}

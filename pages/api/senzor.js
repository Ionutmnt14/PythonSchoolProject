export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "Missing sensor ID" });
  }

  try {
    const response = await fetch(`http://127.0.0.1:8000/senzor/${id}`);
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Python server error" });
  }
}

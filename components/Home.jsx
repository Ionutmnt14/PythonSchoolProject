// Home.jsx
"use client";

import React, { useState, useEffect } from "react";
// 1. Import Recharts components
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer, // To make the chart responsive
} from "recharts";

function SensorDisplay({ sensorId }) {
  const [sensorData, setSensorData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // Add state for formatted chart data
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    setSensorData(null);
    setError(null);
    setChartData([]); // Reset chart data
    setIsLoading(true);

    if (
      sensorId === undefined ||
      sensorId === null ||
      isNaN(parseInt(sensorId))
    ) {
      setIsLoading(false);
      setError("Sensor ID is not provided or invalid.");
      return;
    }

    const apiUrl = `http://localhost:8080/api/sensor/${sensorId}`;

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          return response
            .json()
            .then((errData) => {
              throw new Error(
                `HTTP error ${response.status}: ${
                  errData.error || "Unknown error"
                }`
              );
            })
            .catch(() => {
              throw new Error(`HTTP error! status: ${response.status}`);
            });
        }
        return response.json();
      })
      .then((data) => {
        if (data.error) {
          setError(`API Error: ${data.error}`);
          setSensorData(null);
        } else {
          setSensorData(data);
          setError(null);

          // --- 2. Format data for Recharts ---
          // Recharts prefers an array of objects. Combine timestamps and values.
          if (
            data.timestamps &&
            data.values &&
            data.timestamps.length === data.values.length
          ) {
            const formattedData = data.timestamps.map((ts, index) => ({
              // Format timestamp for better readability on the axis
              timestamp: new Date(ts).toLocaleTimeString(), // Or format as needed
              value: data.values[index],
            }));
            setChartData(formattedData);
          } else {
            setChartData([]); // Ensure empty array if data is inconsistent
          }
          // --- End of Formatting ---
        }
      })
      .catch((fetchError) => {
        console.error("Failed to fetch sensor data:", fetchError);
        setError(`Failed to load data: ${fetchError.message}`);
        setSensorData(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [sensorId]);

  if (isLoading) {
    return <div>Loading sensor data for ID: {sensorId}...</div>;
  }

  if (error) {
    return (
      <div>
        Error for Sensor ID {sensorId !== undefined ? sensorId : "N/A"}: {error}
      </div>
    );
  }

  if (!sensorData || chartData.length === 0) {
    // Check chartData as well
    return (
      <div>No data available to display chart for Sensor ID {sensorId}.</div>
    );
  }

  // Render sensor details and the chart
  return (
    <div
      style={{
        border: "1px solid lightgray",
        padding: "15px",
        marginBottom: "10px",
      }}
    >
      <h3>Sensor Details (PES ID: {sensorData.pes_id ?? "N/A"})</h3>
      <p>Unit: {sensorData.unit ?? "N/A"}</p>
      <p>Total Records: {sensorData.total_records ?? 0}</p>
      <p>
        Last Timestamp:{" "}
        {sensorData.last_timestamp
          ? new Date(sensorData.last_timestamp).toLocaleString()
          : "N/A"}
      </p>
      <p>Last Value: {sensorData.last_value ?? "N/A"}</p>

      {/* --- 3. Replace Placeholder with Recharts LineChart --- */}
      <div style={{ height: "300px", width: "100%", marginTop: "20px" }}>
        {" "}
        {/* Give chart container dimensions */}
        <ResponsiveContainer>
          <LineChart
            data={chartData} // Use the formatted data
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            {/* Use the 'timestamp' field from formatted data for X-axis */}
            <XAxis dataKey="timestamp" />
            {/* Add domain if needed, e.g., domain={['auto', 'auto']} or specific values */}
            <YAxis />
            <Tooltip /> {/* Shows data on hover */}
            <Legend /> {/* Shows legend for lines */}
            {/* Use the 'value' field from formatted data for the Line */}
            <Line
              type="monotone"
              dataKey="value" // The key in your chartData array for the values
              stroke="#8884d8" // Line color
              activeDot={{ r: 8 }} // Dot on hover
              name={`Sensor ${sensorId} (${sensorData.unit})`} // Name in legend/tooltip
              dot={false} // Disable dots on each point for cleaner look if many points
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {/* --- End of Recharts Integration --- */}
    </div>
  );
}

export default SensorDisplay;

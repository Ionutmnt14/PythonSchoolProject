"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { fade } from "@/motion/variants";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

function SensorDisplay({ sensorId }) {
  // State to store the sensor data fetched from the API
  const [sensorData, setSensorData] = useState(null);

  // State to track whether the data is still loading
  const [isLoading, setIsLoading] = useState(true);

  // State to store any error that occurs during the fetch
  const [error, setError] = useState(null);

  // State to store the formatted data for the chart
  const [chartData, setChartData] = useState([]);

  // useEffect runs whenever the sensorId changes
  useEffect(() => {
    // Reset all states before fetching new data
    setSensorData(null);
    setError(null);
    setChartData([]);
    setIsLoading(true);

    // Validate the sensorId to ensure it is provided and valid
    if (
      sensorId === undefined ||
      sensorId === null ||
      isNaN(parseInt(sensorId))
    ) {
      setIsLoading(false); // Stop loading
      setError("ID-ul senzorului nu este furnizat sau nu este valid."); // Set error message
      return; // Exit the function
    }

    // API endpoint to fetch data for the given sensorId
    const apiUrl = `http://localhost:8080/api/sensor/${sensorId}`;

    // Fetch data from the API
    fetch(apiUrl)
      .then((response) => {
        // Check if the response is not OK (e.g., 404 or 500)
        if (!response.ok) {
          return response
            .json()
            .then((errData) => {
              // Throw an error with details from the API response
              throw new Error(
                `Eroare HTTP ${response.status}: ${
                  errData.error || "Eroare necunoscuta"
                }`
              );
            })
            .catch(() => {
              // Handle cases where the response cannot be parsed
              throw new Error(`Eroare HTTP! status: ${response.status}`);
            });
        }
        // Parse the response as JSON
        return response.json();
      })
      .then((data) => {
        // Check if the API returned an error
        if (data.error) {
          setError(`Eroare API: ${data.error}`); // Set the error message
          setSensorData(null); // Clear sensor data
        } else {
          // Store the fetched data in state
          setSensorData(data);
          setError(null); // Clear any previous error

          // Format the data for the chart
          if (
            data.timestamps &&
            data.values &&
            data.timestamps.length === data.values.length
          ) {
            // Combine timestamps and values into an array of objects
            const formattedData = data.timestamps.map((ts, index) => ({
              timestamp: new Date(ts).toLocaleTimeString(), // Format timestamp
              value: data.values[index], // Use the corresponding value
            }));
            setChartData(formattedData); // Store the formatted data
          } else {
            setChartData([]); // Clear chart data if the API response is inconsistent
          }
        }
      })
      .catch((fetchError) => {
        // Handle any errors that occur during the fetch
        console.error("Nu a reusit preluarea datelor senzorului:", fetchError);
        setError(`Nu a reusit incarcarea datelor: ${fetchError.message}`); // Set error message
        setSensorData(null); // Clear sensor data
      })
      .finally(() => {
        // Mark the loading process as complete
        setIsLoading(false);
      });
  }, [sensorId]); // Re-run this effect whenever sensorId changes

  // Show a loading message while the data is being fetched
  if (isLoading) {
    return (
      <div className="text-white text-center text-2xl">
        Se incarca datele pentru Senzor {sensorId}...
      </div>
    );
  }

  // Show an error message if an error occurred
  if (error) {
    return (
      <div className="text-white text-center text-2xl">
        Eroare incarcand Senzorul {sensorId !== undefined ? sensorId : "N/A"}:{" "}
        {error}
      </div>
    );
  }

  // Show a message if no data is available for the sensor
  if (!sensorData || chartData.length === 0) {
    return (
      <div className="text-white text-center text-2xl">
        Nu exista date disponibile pentru a afisa Senzorul {sensorId}.
      </div>
    );
  }

  // Render the chart and additional sensor details
  return (
    <>
      <div className="w-full h-[90vh] flex flex-col items-center justify-center overflow-hidden gap-14">
        {/* Display the sensor ID as a title */}
        <motion.h1
          variants={fade("up", 0)}
          initial="hidden"
          animate="show"
          className="relative z-50 text-5xl font-bold uppercase bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-900 text-transparent bg-clip-text drop-shadow-lg"
        >
          Grafic Senzor ID: {sensorId}
        </motion.h1>
        <motion.div
          variants={fade("up", 1.2)}
          initial="hidden"
          animate="show"
          className="flex justify-center items-center h-80 max-w-4xl mt-5"
        >
          {/* Render the chart using the formatted data */}
          <LineChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
            width={896}
            height={300}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis stroke="#fff" dataKey="timestamp" />
            <YAxis stroke="#fff" />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
              name={`Sensor ${sensorId} (${sensorData.unit})`}
              dot={false}
            />
          </LineChart>
        </motion.div>
        <div className="text-white flex flex-col gap-1 text-xl">
          {/* Display additional sensor information */}
          <motion.p variants={fade("up", 0.2)} initial="hidden" animate="show">
            Numarul inregistrarilor: {sensorData.total_records ?? 0}
          </motion.p>
          <motion.p
            variants={fade("up", 0.4)}
            initial="hidden"
            animate="show"
            className="font-bold"
          >
            Ultima inregistrare: [
            {sensorData.last_timestamp
              ? new Date(sensorData.last_timestamp).toLocaleString()
              : "N/A"}{" "}
            , {sensorData.last_value}, {sensorData.pes_id}]
          </motion.p>
          <motion.p variants={fade("up", 0.6)} initial="hidden" animate="show">
            Numar Public Electricity Supplier (pes_id):{" "}
            {sensorData.pes_id ?? "N/A"}
          </motion.p>
          <motion.p variants={fade("up", 0.8)} initial="hidden" animate="show">
            Ultimul timestamp (datetime_gmt):{" "}
            {sensorData.last_timestamp ?? "N/A"}
          </motion.p>
          <motion.p variants={fade("up", 1)} initial="hidden" animate="show">
            Ultima valoare (generation_mw): {sensorData.last_value ?? "N/A"}
          </motion.p>
        </div>
      </div>
    </>
  );
}

export default SensorDisplay;

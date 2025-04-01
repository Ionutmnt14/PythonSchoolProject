"use client";

// App.js (or your main application file)
import SensorDisplay from "@/components/Home";
import React from "react";
import Bg from "@/public/bg.jpg";
// 1. Import routing components
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams,
} from "react-router-dom";
import Image from "next/image";
import { motion } from "motion/react";
import { fade } from "@/motion/variants";

function HomePage() {
  // Sensor IDs corresponding to python backend (0, 1, 2)
  const sensorIds = [0, 1, 2];
  // You could fetch sensor names/details from an API endpoint if needed
  const sensorNames = {
    0: "Sensor PV 10", // Example names
    1: "Sensor PV 11",
    2: "Sensor PV 12",
  };

  return (
    <div className="w-full h-screen flex items-center gap-32 flex-col">
      <Image
        src={Bg}
        alt="bg-image"
        className="w-full h-screen object-cover absolute -z-10 "
        style={{ filter: "blur(1px)" }}
      />
      <div className="absolute inset-0 bg-[#0a192f]/60 backdrop-blur-xs z-0"></div>

      <motion.h1
        variants={fade("down", 0.2)}
        initial="hidden"
        whileInView="show"
        className="text-7xl mt-32 font-bold bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-900 text-transparent bg-clip-text drop-shadow-lg"
      >
        Sensor Dashboard
      </motion.h1>
      <div className="flex flex-col items-center gap-10">
        <motion.p
          className="text-white text-xl relative z-10"
          variants={fade("down", 0.4)}
          initial="hidden"
          whileInView="show"
        >
          Selectati un senzor:
        </motion.p>
        <div className="flex gap-3">
          {sensorIds.map((id) => (
            // Use Link component for navigation
            <Link key={id} to={`/sensor/${id}`}>
              <motion.button
                className="bg-[#112240]/80 hover:bg-[#112240] text-white font-semibold px-6 py-3 rounded-xl shadow-lg backdrop-blur-sm transition"
                variants={fade("up", 0.8)}
                initial="hidden"
                whileInView="show"
                whileHover="hover"
                whileTap="active"
              >
                {sensorNames[id] || `Sensor ${id}`}{" "}
              </motion.button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// Create a Sensor Page Wrapper Component ---
// This component gets the ID from the URL and renders SensorDisplay
function SensorPage() {
  // useParams hook gets the :id part from the URL path "/sensor/:id"
  const { id } = useParams();
  // Convert id from URL string to integer for the SensorDisplay prop
  const sensorId = parseInt(id, 10);

  // Basic check if the ID is a valid number
  if (isNaN(sensorId)) {
    return <div>Error: Invalid Sensor ID in URL.</div>;
  }

  // Render the SensorDisplay component, passing the ID from the URL
  return (
    <div>
      <Link to="/">
        <button style={{ marginBottom: "15px" }}>
          &larr; Back to Dashboard
        </button>
      </Link>
      {/* Render the actual sensor display */}
      <SensorDisplay sensorId={sensorId} />
    </div>
  );
}

// Main App Component with Router Setup ---
function App() {
  return (
    // Wrap everything in the Router
    <Router>
      <div>
        {" "}
        {/* A container div is usually good practice */}
        {/* Define the routes */}
        <Routes>
          {/* Route for the home page */}
          <Route path="/" element={<HomePage />} />

          {/* Route for individual sensor pages */}
          {/* ':id' is a URL parameter that react-router makes available */}
          <Route path="/sensor/:id" element={<SensorPage />} />

          <Route
            path="*"
            element={
              <div>
                <h2>Page Not Found</h2>
                <Link to="/">Go Home</Link>
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

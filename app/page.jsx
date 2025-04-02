"use client";

import React from "react";
import Bg from "@/public/bg.jpg";
import Image from "next/image";
import { motion } from "motion/react";
import { fade } from "@/motion/variants";
import Link from "next/link";

function HomePage() {
  // Define the IDs of the sensors (these correspond to the backend data)
  const sensorIds = [0, 1, 2];

  // Define the names of the sensors (you could fetch these from an API if needed)
  const sensorNames = {
    0: "Sensor 0",
    1: "Sensor 1",
    2: "Sensor 2",
  };

  return (
    <div className="w-full h-screen flex items-center gap-32 flex-col">
      {/* Display the background image */}
      <Image
        src={Bg} // The source of the background image
        alt="bg-image" // Alt text for accessibility
        className="w-full h-screen object-cover absolute -z-10" // Styling for full-screen background
        style={{ filter: "blur(1px)" }} // Apply a slight blur effect to the background
      />
      {/* Add a semi-transparent overlay on top of the background */}
      <div className="absolute inset-0 bg-[#0a192f]/60 backdrop-blur-xs z-0"></div>

      {/* Display the main title with animation */}
      <motion.h1
        variants={fade("down", 0.2)} // Apply fade animation with a slight delay
        initial="hidden" // Initial state of the animation
        whileInView="show" // Final state of the animation when in view
        className="text-7xl mt-32 font-bold bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-900 text-transparent bg-clip-text drop-shadow-lg"
      >
        Grafice Senzori {/* Main title text */}
      </motion.h1>

      {/* Container for the sensor selection */}
      <div className="flex flex-col items-center gap-10">
        {/* Display a subtitle with animation */}
        <motion.p
          className="text-white text-xl relative z-10"
          variants={fade("down", 0.4)} // Apply fade animation with a longer delay
          initial="hidden" // Initial state of the animation
          whileInView="show" // Final state of the animation when in view
        >
          Selectati un senzor: {/* Subtitle text */}
        </motion.p>

        {/* Display buttons for each sensor */}
        <div className="flex gap-3">
          {sensorIds.map((id) => (
            <Link key={id} href={`/sensor/${id}`}>
              {" "}
              {/* Link to the sensor page */}
              <motion.button
                className="bg-[#112240]/80 hover:bg-[#112240] text-white font-semibold px-6 py-3 rounded-xl shadow-lg backdrop-blur-sm transition"
                variants={fade("up", 0.8)} // Apply fade animation with a longer delay
                initial="hidden" // Initial state of the animation
                whileInView="show" // Final state of the animation when in view
                whileHover="hover" // Animation when the button is hovered
                whileTap="active" // Animation when the button is clicked
              >
                {sensorNames[id] || `Sensor ${id}`}{" "}
                {/* Display the sensor name or fallback to "Sensor X" */}
              </motion.button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage;

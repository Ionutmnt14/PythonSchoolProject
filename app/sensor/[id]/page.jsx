"use client";

import Link from "next/link";
import SensorDisplay from "@/components/Home";
import React from "react";
import Bg from "@/public/bg.jpg";
import Image from "next/image";
import { motion } from "motion/react";
import { fade } from "@/motion/variants";
import { TiArrowBack } from "react-icons/ti";

export default function SensorPage({ params }) {
  // Unwrap the params object to access the dynamic route parameter
  const unwrappedParams = React.use(params); // React.use() is used to unwrap the params Promise
  const { id } = unwrappedParams; // Extract the 'id' parameter from the unwrapped params
  const sensorId = parseInt(id, 10); // Convert the 'id' parameter to an integer

  // Check if the sensorId is not a valid number
  if (isNaN(sensorId)) {
    // If the sensorId is invalid, show an error message
    return <div>Error: Invalid Sensor ID in URL.</div>;
  }

  return (
    <>
      {/* Display the background image */}
      <Image
        src={Bg} // The source of the background image
        alt="bg-image" // Alt text for accessibility
        className="w-full h-screen object-cover absolute -z-10" // Styling for full-screen background
        style={{ filter: "blur(1px)" }} // Apply a slight blur effect to the background
      />
      {/* Add a semi-transparent overlay on top of the background */}
      <div className="absolute inset-0 bg-[#0a192f]/60 backdrop-blur-xs -z-10"></div>

      {/* Main container for the page */}
      <div className="w-full h-screen">
        {/* Back button to navigate to the homepage */}
        <Link href="/">
          <motion.button
            variants={fade("down", 0.2)} // Apply fade animation with a slight delay
            initial="hidden" // Initial state of the animation
            animate="show"
            whileHover="hover" // Animation when the button is hovered
            whileTap="active" // Final state of the animation
            className="px-4 py-4 text text-white flex flex-row items-center justify-center bg-[#112240]/80 hover:bg-[#112240] font-semibold rounded-xl shadow-lg backdrop-blur-sm transition"
          >
            <TiArrowBack className="size-6" /> {/* Back arrow icon */}
            Inapoi {/* Text for the back button */}
          </motion.button>
        </Link>

        {/* Display the sensor data using the SensorDisplay component */}
        <SensorDisplay sensorId={sensorId} />
      </div>
    </>
  );
}

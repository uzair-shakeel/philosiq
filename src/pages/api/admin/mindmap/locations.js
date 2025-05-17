import connectToDatabase from "../../../../lib/mongodb";
import mongoose from "mongoose";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ 
      success: false, 
      message: "Method not allowed" 
    });
  }

  try {
    // Connect to database
    await connectToDatabase();
    const mindmapCollection = mongoose.connection.db.collection("mindmapData");

    // Get unique cities
    const cities = await mindmapCollection.distinct("demographics.city");
    
    // Get unique states
    const states = await mindmapCollection.distinct("demographics.state");
    
    // Get unique countries
    const countries = await mindmapCollection.distinct("demographics.country");

    // Filter out null, undefined, or empty values
    const filteredCities = cities.filter(city => city && city !== "Unknown");
    const filteredStates = states.filter(state => state && state !== "Unknown");
    const filteredCountries = countries.filter(country => country && country !== "Unknown");

    return res.status(200).json({
      success: true,
      locations: {
        cities: filteredCities,
        states: filteredStates,
        countries: filteredCountries
      }
    });
  } catch (error) {
    console.error("Error fetching location options:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch location options",
      error: error.message
    });
  }
} 
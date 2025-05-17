import connectToDatabase from "../../../../lib/mongodb";
import mongoose from "mongoose";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  try {
    await connectToDatabase();
    const mindmapCollection = mongoose.connection.db.collection("mindmapData");

    // Get query parameters for filtering
    const { country, state } = req.query;

    // Base query to get all distinct locations
    let countriesQuery = {};
    let statesQuery = {};
    let citiesQuery = {};

    // If country is specified, filter states and cities by that country
    if (country) {
      statesQuery = { "demographics.country": country };
      citiesQuery = { "demographics.country": country };
    }

    // If state is specified, filter cities by that state
    if (state) {
      citiesQuery = {
        ...citiesQuery,
        "demographics.state": state,
      };
    }

    // Get distinct countries, states, and cities
    const countries = await mindmapCollection.distinct("demographics.country", {
      "demographics.country": { $ne: null, $ne: "" },
    });
    const states = await mindmapCollection.distinct("demographics.state", {
      ...statesQuery,
      "demographics.state": { $ne: null, $ne: "" },
    });
    const cities = await mindmapCollection.distinct("demographics.city", {
      ...citiesQuery,
      "demographics.city": { $ne: null, $ne: "" },
    });

    // Filter out null, undefined, or "Unknown" values
    const filteredCountries = countries.filter((c) => c && c !== "Unknown");
    const filteredStates = states.filter((s) => s && s !== "Unknown");
    const filteredCities = cities.filter((c) => c && c !== "Unknown");

    return res.status(200).json({
      success: true,
      locations: {
        countries: filteredCountries,
        states: filteredStates,
        cities: filteredCities,
      },
    });
  } catch (error) {
    console.error("Error fetching location data:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch location data",
      error: error.message,
    });
  }
}

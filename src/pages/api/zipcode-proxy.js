/**
 * Simple proxy for the Zippopotam.us API
 * API documentation: http://www.zippopotam.us/
 */

export default async function handler(req, res) {
  const { zipcode, country } = req.query;

  if (!zipcode) {
    return res.status(400).json({
      isValid: false,
      error: "Zipcode is required",
    });
  }

  try {
    console.log(`Validating zipcode: ${zipcode}`);

    // Auto-detect country based on zipcode format
    // For now we'll default to US, but this could be expanded
    // to detect other formats (e.g., Canadian postcodes, UK postcodes)
    let detectedCountry = country || "US";
    
    // Simple country detection based on format
    // This is a basic implementation that could be expanded
    if (!country) {
      // Canadian postal codes: A1A 1A1 format (letter-number-letter number-letter-number)
      if (/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(zipcode)) {
        detectedCountry = "CA";
      }
      // UK postcodes: Various formats but generally longer with letters
      else if (/^[A-Za-z]{1,2}\d[A-Za-z\d]? \d[A-Za-z]{2}$/.test(zipcode)) {
        detectedCountry = "GB";
      }
      // Default to US for 5-digit or 5+4 format
      else {
        detectedCountry = "US";
      }
    }

    // Direct call to the Zippopotam.us API
    const apiUrl = `https://api.zippopotam.us/${detectedCountry}/${zipcode}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      return res.status(400).json({
        isValid: false,
        error: "Postal code not found",
      });
    }

    const data = await response.json();

    // Format the location data
    const location = {
      zipcode: zipcode,
      city: data.places?.[0]?.["place name"] || "Unknown City",
      state:
        data.places?.[0]?.state ||
        data.places?.[0]?.["state abbreviation"] ||
        "Unknown State",
      state_code: data.places?.[0]?.["state abbreviation"] || "",
      country: data.country || "Unknown Country",
      country_code: data["country abbreviation"] || detectedCountry,
      latitude: data.places?.[0]?.latitude || "0",
      longitude: data.places?.[0]?.longitude || "0",
    };

    return res.status(200).json({
      isValid: true,
      location,
      detectedCountry,
    });
  } catch (error) {
    console.error("Error validating zipcode:", error);
    return res.status(500).json({
      isValid: false,
      error: "Failed to validate postal code. Please try again.",
    });
  }
}

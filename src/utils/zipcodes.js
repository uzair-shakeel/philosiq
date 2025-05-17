/**
 * Simple zipcode validation utility using the free Zippopotam.us API
 * API documentation: http://www.zippopotam.us/
 */

/**
 * Validates a zipcode using the Zippopotam.us API
 * @param {string} zipcode - The zipcode/postal code to validate
 * @param {string} countryCode - The country code (default: 'US')
 * @returns {Promise<Object>} - Result with validation status and location data
 */
export async function validateZipcode(zipcode, countryCode = "US") {
  if (!zipcode) {
    return {
      isValid: false,
      error: "Please enter a postal code",
    };
  }

  try {
    // Use the Zippopotam.us API to validate the zipcode
    const apiUrl = `https://api.zippopotam.us/${countryCode}/${zipcode}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      return {
        isValid: false,
        error: "Postal code not found",
      };
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
      country_code: data["country abbreviation"] || countryCode,
      latitude: data.places?.[0]?.latitude || "0",
      longitude: data.places?.[0]?.longitude || "0",
    };

    return {
      isValid: true,
      location,
    };
  } catch (error) {
    console.error("Error validating zipcode:", error);
    return {
      isValid: false,
      error: "Failed to validate postal code. Please try again.",
    };
  }
}

/**
 * Legacy function for backward compatibility
 */
export function validateUSZipcode(zipcode) {
  if (!zipcode || !/^\d{5}$/.test(zipcode)) {
    return {
      isValid: false,
      error: "Please enter a valid 5-digit US zipcode",
    };
  }

  // Return a placeholder response
  return {
    isValid: true,
    location: {
      zipcode: zipcode,
      city: "United States",
      state: "United States",
      state_code: "US",
      country: "United States",
      country_code: "US",
      latitude: "0",
      longitude: "0",
    },
  };
}

/**
 * Returns an array of supported countries for postal code validation
 * @returns {Array} - Array of country objects with code and name
 */
export function getSupportedCountries() {
  return Object.entries(COUNTRY_NAMES).map(([code, name]) => ({
    code,
    name,
  }));
}

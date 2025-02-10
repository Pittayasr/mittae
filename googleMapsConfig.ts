// googleMapsConfig.ts
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export const geocodeAddress = async (address: string) => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${GOOGLE_MAPS_API_KEY}`
    );
    console.log("Geocoding Request URL:", response.url);
    const data = await response.json();
    console.log("Geocoding Response Data:", data);
    if (data.status !== "OK") {
      console.error("Geocoding error details:", data);
      throw new Error(`Geocoding failed: ${data.status}`);
    }

    return data.results[0].geometry.location;
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    throw error;
  }
};

export { GOOGLE_MAPS_API_KEY };

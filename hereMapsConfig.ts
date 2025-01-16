const HERE_MAPS_API_KEY = "mz6kcLsOgVgeN9IN-9errBLT6EiJrtM4GnGjODSJaJg";

export const geocodeAddress = async (address: string) => {
  try {
    const response = await fetch(
      `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(
        address
      )}&apikey=${HERE_MAPS_API_KEY}&lang=th-TH` // ระบุภาษาไทย
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    if (data.items && data.items.length > 0) {
      const { lat, lng } = data.items[0].position;
      return { lat, lng };
    } else {
      throw new Error("No results found.");
    }
  } catch (error) {
    console.error("Error fetching geocoding results:", error);
    throw error;
  }
};

export { HERE_MAPS_API_KEY };

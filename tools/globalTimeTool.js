// ✅ NEW FILE

/*export async function globalTimeTool(location) {

  const now = new Date();

  return `🕒 Current time in ${location} is:\n${now.toLocaleString()}`;
}*/



import { tool } from "@langchain/core/tools";
import { z } from "zod";

export const globalTimeTool = tool(
  async ({ city }) => {

    // ✅ GET CITY + TIMEZONE
    const geoUrl =
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}`;

    const geoRes = await fetch(geoUrl);

    const geoData = await geoRes.json();

    // ✅ CITY NOT FOUND
    if (
      !geoData.results ||
      geoData.results.length === 0
    ) {

      return `❌ Sorry, I couldn't find the city "${city}"`;
    }

    // ✅ FIRST MATCH
    const place = geoData.results[0];

    const timezone = place.timezone;

    // ✅ REAL TIME
    const now = new Date().toLocaleString(
      "en-US",
      {
        timeZone: timezone,
      }
    );

    return (
      `🕒 Current date & time in ` +
      `${place.name}, ${place.country}:\n` +
      `${now}\n` +
      `🌍 Timezone: ${timezone}`
    );
  },

  {
    name: "GlobalDateTime",

    description:
      "Get current date and time for any city in the world",

    schema: z.object({
      city: z.string().describe(
        "City name like Tokyo, Paris, Delhi"
      ),
    }),
  }
);
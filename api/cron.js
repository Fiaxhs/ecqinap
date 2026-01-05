export function GET(request) {
  // Paris coordinates
  const lat = 48.8566;
  const lon = 2.3522;

  // Open-Meteo API - free, no API key required
  // Weather codes for snow: 71, 73, 75 (snow fall), 77 (snow grains), 85, 86 (snow showers)
  const snowWeatherCodes = [71, 73, 75, 77, 85, 86];

  return fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=weather_code`
  )
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      const currentWeatherCode = json?.current?.weather_code;
      const isSnowing = snowWeatherCodes.includes(currentWeatherCode);

      if (isSnowing) {
        return fetch(process.env.SET_SNOWING_TRUE).then(() => {
          return new Response(
            JSON.stringify({
              message: `Weather code ${currentWeatherCode} detected in Paris - it's snowing!`,
            }),
            {
              status: 200,
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
        });
      } else {
        return fetch(process.env.SET_SNOWING_FALSE).then(() => {
          return new Response(
            JSON.stringify({
              message: `Weather code ${currentWeatherCode} detected in Paris - not snowing.`,
            }),
            {
              status: 200,
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
        });
      }
    })
    .catch(() => {
      return new Response(null, { status: 500 });
    });
}

export const config = {
  runtime: "edge",
};

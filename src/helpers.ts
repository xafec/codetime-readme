export const getSecureEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
};

export const getEndpointWithTime = (days: string = "7"): string => {
  const defaultDays = Number(days);
  const allowedDays = [1, 3, 7, 14, 28, 90];
  const minutesPerDay = 1440;
  try {
    const daysParam = allowedDays.includes(Number(days))
      ? Number(days)
      : defaultDays;
    const minutesParam = daysParam * minutesPerDay;

    return `https://api.codetime.dev/top?field=language&minutes=${minutesParam}&limit=5`;
  } catch (error) {
    console.error(
      "An error occurred while getting the endpoint with time:",
      error
    );
    throw error;
  }
};

export const getEndpointWithTotalTime = (days: string = "7"): string => {
  const defaultDays = days;
  const allowedDays = ["1", "3", "7", "14", "28", "90"];

  try {
    const daysParam = allowedDays.includes(days) ? days : defaultDays;

    return `https://api.codetime.dev/stats?by=time&limit=${daysParam}&unit=days`;
  } catch (error) {
    console.error(
      "An error occurred while getting the endpoint with total time:",
      error
    );
    throw error;
  }
};

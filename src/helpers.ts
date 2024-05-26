import { allowedDays } from "./constants.ts";

type AllowedDays = (typeof allowedDays)[number];

const API_BASE_URL = "https://api.codetime.dev";

class EnvVarError extends Error {
  constructor(key: string) {
    super(`Environment variable ${key} is not set`);
    this.name = "EnvVarError";
  }
}

export const getSecureEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new EnvVarError(key);
  }
  return value;
};

export const getEndpointWithTime = (days: AllowedDays = 7): string => {
  const minutesPerDay = 1440;
  const minutesParam = days * minutesPerDay;

  return `${API_BASE_URL}/top?field=language&minutes=${minutesParam}&limit=5`;
};

export const getEndpointWithTotalTime = (days: AllowedDays = 7): string => {
  return `${API_BASE_URL}/stats?by=time&limit=${days}&unit=days`;
};

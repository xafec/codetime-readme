import {
  getEndpointWithTime,
  getEndpointWithTotalTime,
  getSecureEnv,
} from "./helpers";

export const allowedDays = [1, 3, 7, 14, 28, 90] as const;

type AllowedDays = (typeof allowedDays)[number];

const days = process.env.INPUT_DAYS_COUNT as unknown as AllowedDays;

export const CODETIME_API_TOP_LANGUAGES_ENDPOINT = getEndpointWithTime(days);

export const CODETIME_API_TOTAL_TIME_ENDPOINT = getEndpointWithTotalTime(days);

export const CODETIME_API_KEY = getSecureEnv("INPUT_CODETIME_COOKIE_KEY");

// Time Constants
export const MS_OF_HOUR = 3600000;
export const MS_OF_MINUTE = 60000;

// Comment Constants
export const START_COMMENT = "<!--START_SECTION:codetime-->";
export const END_COMMENT = "<!--END_SECTION:codetime-->";

// User's Constants
export const user = process.env.INPUT_USERNAME || "";
export const ghtoken = process.env.INPUT_GH_TOKEN || "";
export const cookies = { CODETIME_SESSION: CODETIME_API_KEY };

// Regex
export const listReg = new RegExp(`${START_COMMENT}[\\s\\S]+${END_COMMENT}`);

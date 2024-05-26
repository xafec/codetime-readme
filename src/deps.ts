import {
  getSecureEnv,
  getEndpointWithTime,
  getEndpointWithTotalTime,
} from "./helpers";

// API
export const CODETIME_API_TOP_LANGUAGES_ENDPOINT = getEndpointWithTime(
  process.env.INPUT_DAYS_COUNT
);

export const CODETIME_API_TOTAL_TIME_ENDPOINT = getEndpointWithTotalTime(
  process.env.INPUT_DAYS_COUNT
);

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

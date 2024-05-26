import "dotenv/config";
import axios from "axios";
import { Octokit } from "@octokit/rest";
import {
  CODETIME_API_TOP_LANGUAGES_ENDPOINT,
  CODETIME_API_TOTAL_TIME_ENDPOINT,
  cookies,
  END_COMMENT,
  ghtoken,
  listReg,
  MS_OF_HOUR,
  MS_OF_MINUTE,
  START_COMMENT,
  user,
} from "./constants.ts";
import { LanguageData, Time, TimeData, TimeItem } from "./types.ts";

async function getTotalTime(): Promise<Time> {
  try {
    const { data } = await axios.get<TimeData>(
      CODETIME_API_TOTAL_TIME_ENDPOINT,
      {
        headers: { Cookie: `CODETIME_SESSION=${cookies.CODETIME_SESSION}` },
      },
    );

    const totalDuration = data.data.reduce(
      (acc: number, item: TimeItem) => acc + item.duration,
      0,
    );
    const hours = Math.floor(totalDuration / MS_OF_HOUR);
    const minutes = Math.floor((totalDuration % MS_OF_HOUR) / MS_OF_MINUTE);
    return { hours, minutes };
  } catch (error) {
    console.error("Error fetching total time:", error);
    throw error; // Re-throw to handle error at a higher level
  }
}

function makeGraph(percent: number): string {
  const doneBlock = "⣿";
  const emptyBlock = "⣀";
  const percentRound = Math.round(percent);
  return `${doneBlock.repeat(
    Math.floor(percentRound / 4),
  )}${emptyBlock.repeat(25 - Math.floor(percentRound / 4))}`;
}

async function getStats(): Promise<string> {
  try {
    const response = await axios.get<LanguageData[]>(
      CODETIME_API_TOP_LANGUAGES_ENDPOINT,
      {
        headers: { Cookie: `CODETIME_SESSION=${cookies.CODETIME_SESSION}` },
      },
    );

    const { hours: totalHours, minutes: totalMinutes } = await getTotalTime();
    const totalTime = totalHours * 60 + totalMinutes;
    const totalTimeText = `Total Time: ${totalHours} hrs ${totalMinutes} mins\n\n`;

    const dataList = response.data.slice(0, 5).map((language) => {
      const hours = Math.floor(language.minutes / 60);
      const minutes = language.minutes % 60;
      const timeText = hours
        ? `${hours} hrs ${minutes} mins`
        : `${minutes} mins`;
      const languageNameLength = language.field.length;
      const timeTextLength = timeText.length;
      const percent = (language.minutes / totalTime) * 100;
      return `${
        language.field.charAt(0).toUpperCase() + language.field.slice(1)
      }${" ".repeat(12 - languageNameLength)}${timeText}${" ".repeat(
        20 - timeTextLength,
      )}${makeGraph(percent)}   ${percent.toFixed(2)} %`;
    });

    const dataString = dataList.join(" \n");
    return "```txt\n" + totalTimeText + dataString + "\n```";
  } catch (error) {
    console.error("Error fetching coding stats:", error);
    throw error;
  }
}

function decodeReadme(data: string): string {
  return Buffer.from(data, "base64").toString("utf8");
}

function generateNewReadme(stats: string, readme: string): string {
  const statsInReadme = `${START_COMMENT}\n${stats}\n${END_COMMENT}`;
  return readme.replace(listReg, statsInReadme);
}

(async () => {
  try {
    const octokit = new Octokit({ auth: ghtoken });
    const { data: contents } = await octokit.repos.getReadme({
      owner: user,
      repo: user,
    });

    const stats = await getStats();
    const readmeContent = decodeReadme(contents.content);
    const newReadme = generateNewReadme(stats, readmeContent);

    // Only update the README if the content has changed
    if (newReadme !== readmeContent) {
      await octokit.repos.createOrUpdateFileContents({
        owner: user,
        repo: user,
        path: contents.path,
        message: "Updated with CodeTime Stats",
        content: Buffer.from(newReadme).toString("base64"),
        sha: contents.sha,
        branch: "main",
      });
      console.log("Updated README with CodeTime Stats");
    } else {
      console.log("README already up-to-date");
    }
  } catch (error) {
    console.error("An error occurred:", error);
    // Handle error appropriately, e.g., log to error tracking service
  }
})();

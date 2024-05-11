import "dotenv/config";
import axios from "axios";
import { Octokit } from "@octokit/rest";
import {
  CODETIME_API_TOTAL_TIME_ENDPOINT,
  CODETIME_API_TOP_LANGUAGES_ENDPOINT,
  MS_OF_HOUR,
  MS_OF_MINUTE,
  START_COMMENT,
  END_COMMENT,
  user,
  ghtoken,
  cookies,
  listReg,
} from "./deps";

async function getTotalTime() {
  const { data } = await axios.get(CODETIME_API_TOTAL_TIME_ENDPOINT, {
    headers: { Cookie: `CODETIME_SESSION=${cookies.CODETIME_SESSION}` },
  });
  const total_duration = data.data.reduce(
    (acc: number, item: any) => acc + item.duration,
    0
  );
  const hours = Math.floor(total_duration / MS_OF_HOUR);
  const minutes = Math.floor((total_duration % MS_OF_HOUR) / MS_OF_MINUTE);
  return { hours, minutes };
}

function makeGraph(percent: number) {
  const done_block = "⣿";
  const empty_block = "⣀";
  const percent_round = Math.round(percent);
  return `${done_block.repeat(
    Math.floor(percent_round / 4)
  )}${empty_block.repeat(25 - Math.floor(percent_round / 4))}`;
}

async function getStats() {
  const { data } = await axios.get(CODETIME_API_TOP_LANGUAGES_ENDPOINT, {
    headers: { Cookie: `CODETIME_SESSION=${cookies.CODETIME_SESSION}` },
  });
  const { hours: total_hours, minutes: total_minutes } = await getTotalTime();
  const total_time = total_hours * 60 + total_minutes;
  const total_time_text = `Total Time: ${total_hours} hrs ${total_minutes} mins\n\n`;
  const data_list = data.slice(0, 5).map((l: any) => {
    const hours = Math.floor(l.minutes / 60);
    const minutes = l.minutes % 60;
    const time_text = hours
      ? `${hours} hrs ${minutes} mins`
      : `${minutes} mins`;
    const ln = l.field.length;
    const ln_text = time_text.length;
    const percent = (l.minutes / total_time) * 100;
    return `${l.field.charAt(0).toUpperCase() + l.field.slice(1)}${" ".repeat(
      12 - ln
    )}${time_text}${" ".repeat(20 - ln_text)}${makeGraph(
      percent
    )}   ${percent.toFixed(2)} %`;
  });
  const data_str = data_list.join(" \n");
  return "```txt\n" + total_time_text + data_str + "\n```";
}

function decodeReadme(data: string) {
  return Buffer.from(data, "base64").toString("utf8");
}

function generatenewReadme(stats: string, readme: string) {
  const statsinReadme = `${START_COMMENT}\n${stats}\n${END_COMMENT}`;
  const newReadme = readme.replace(listReg, statsinReadme);
  return newReadme;
}

(async function main() {
  const octokit = new Octokit({ auth: ghtoken });
  const { data: contents } = await octokit.repos.getReadme({
    owner: user,
    repo: user,
  });
  const stats = await getStats();
  const rdmd = decodeReadme(contents.content);
  const newreadme = generatenewReadme(stats, rdmd);
  if (newreadme !== rdmd) {
    await octokit.repos.createOrUpdateFileContents({
      owner: user,
      repo: user,
      path: contents.path,
      message: "Updated with CodeTime Stats",
      content: Buffer.from(newreadme).toString("base64"),
      sha: contents.sha,
      branch: "main",
    });
    console.log("Updated with CodeTime Stats");
  }
})();

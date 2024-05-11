import base64
import requests
import re
import os
from github import Github
from requests.cookies import RequestsCookieJar
import time

# --- CodeTime Specific Configuration ---
CODETIME_API_TOP_LANGUAGES_ENDPOINT = (
    "https://api.codetime.dev/top?field=language&minutes=10080&limit=5"
)
CODETIME_API_TOTAL_TIME_ENDPOINT = (
    "https://api.codetime.dev/stats?by=time&limit=7&unit=days"
)

CODETIME_API_KEY = os.getenv(
    "INPUT_CODETIME_COOKIE_KEY"
)  # only now, as there is no available API
# ----------------------------------------

MS_OF_HOUR = 3600000
MS_OF_MINUTE = 60000

START_COMMENT = "<!--START_SECTION:codetime-->"
END_COMMENT = "<!--END_SECTION:codetime-->"

listReg = f"{START_COMMENT}[\\s\\S]+{END_COMMENT}"
user = os.getenv("INPUT_USERNAME") or ""
ghtoken = os.getenv("INPUT_GH_TOKEN") or ""

cookies = RequestsCookieJar()
cookies.set("CODETIME_SESSION", CODETIME_API_KEY or "")


def getTotalTime():
    data = requests.get(CODETIME_API_TOTAL_TIME_ENDPOINT, cookies=cookies).json()
    total_duration = sum(item["duration"] for item in data["data"])
    hours = total_duration // MS_OF_HOUR
    minutes = (total_duration % MS_OF_HOUR) // MS_OF_MINUTE
    return hours, minutes


def makeGraph(percent: float):
    done_block = "⣿"
    empty_block = "⣀"
    percent_round = round(percent)
    return (
        f"{done_block*int(percent_round/4)}{empty_block*int(25-int(percent_round/4))}"
    )


def getStats():
    cookies = RequestsCookieJar()
    cookies.set("CODETIME_SESSION", CODETIME_API_KEY or "")
    data = requests.get(CODETIME_API_TOP_LANGUAGES_ENDPOINT, cookies=cookies).json()
    total_hours, total_minutes = getTotalTime()
    total_time = total_hours * 60 + total_minutes
    total_time_text = f"Total Time: {total_hours} hrs {total_minutes} mins\n\n"
    data_list = []
    for l in data[:5]:
        hours = l["minutes"] // 60
        minutes = l["minutes"] % 60
        time_text = f"{hours} hrs {minutes} mins" if hours else f"{minutes} mins"
        ln = len(l["field"])
        ln_text = len(time_text)
        percent = l["minutes"] / total_time * 100
        op = f"{l['field'].capitalize()}{' '*(12-ln)}{time_text}{' '*(20-ln_text)}{makeGraph(percent)}   {percent:.2f} %"
        data_list.append(op)
    data = " \n".join(data_list)
    return "```txt\n" + total_time_text + data + "\n```"


def decodeReadme(data: str):
    decodedBytes = base64.b64decode(data)
    decodedStr = str(decodedBytes, "utf-8")
    return decodedStr


def generatenewReadme(stats: str, readme: str):
    statsinReadme = f"{START_COMMENT}\n{stats}\n{END_COMMENT}"
    newReadme = re.sub(listReg, statsinReadme, readme)
    return newReadme


if __name__ == "__main__":
    g = Github(ghtoken)
    repositories_path = "/".join([user, user])
    repo = g.get_repo(repositories_path)
    contents = repo.get_readme()
    stats = getStats()
    rdmd = decodeReadme(contents.content)
    newreadme = generatenewReadme(stats=stats, readme=rdmd)
    if newreadme != rdmd:
        repo.update_file(
            path=contents.path,
            message="Updated with CodeTime Stats",
            content=newreadme,
            sha=contents.sha,
            branch="main",
        )
        print("Updated with CodeTime Stats")

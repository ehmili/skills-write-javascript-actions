const core = require("@actions/core");
const github = require("@actions/github");
const axios = require("axios");

async function run() {
  try {
    const response = await axios.get("https://icanhazdadjoke.com/", {
      headers: {
        Accept: "application/json",
      },
    });

    const joke = response.data.joke;

    core.info(`Dad Joke: ${joke}`);

    const token = process.env.GITHUB_TOKEN;

    const octokit = github.getOctokit(token);

    const issue = github.context.payload.issue;

    if (issue) {
      await octokit.rest.issues.createComment({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        issue_number: issue.number,
        body: `😂 **Dad Joke:**\n\n${joke}`,
      });
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();

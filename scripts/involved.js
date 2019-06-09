// Description:
//   Tools for the community involvement
//
// Dependencies:
//
//
// Configuration:
//   HUBOT_GITHUB_TOKEN
//
// Commands:
//   hubot how can i help - returns a list of "help wanted" issues in select repos
//
// Notes:
//
//
// Author:
//   radius314

module.exports = robot => {
  let github = require("githubot")(robot);

  robot.respond(/how can i help/i, msg => {
    const notFoundResponse = "I couldn't discover something automatically... I'm sure you could find something, if you ask a human.";
    let response = [];

    github.get('orgs/bmlt-enabled/repos', (reposList) => {
      Promise.all(reposList.map(repo => {
        return new Promise((resolve, reject) => {
          github.get(`repos/${repo.full_name}/issues`, (issues) => {
            for (issue of issues) {
              if (hasLabels(issue['labels'], "help wanted") || hasLabels(issue['labels'], "needs qa")) {
                if (issue['assignee'] == null) {
                  response.push(`${issue['title']}: ${issue['html_url']} _${issue['labels'].map(value => value['name']).join(",")}_`);
                }
              }
            }

            resolve();
          });
        })
      })).then(() => {
        msg.send(response.length > 0 ? response.join("\n") : notFoundResponse);
      });
    });
  });
};

function hasLabels(labels, name) {
  for (let label of labels) {
    if (label['name'] === name) {
      return true;
    }
  }

  return false;
}

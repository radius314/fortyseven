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
let utils = require('./utils.js');
let reposList = [
  "bmlt-enabled/tomato",
  "bmlt-enabled/bmlt-root-server",
  "bmlt-enabled/bmlt-wordpress-satellite-plugin",
  "bmlt-enabled/bmlt-portal",
  "bmlt-enabled/list-locations-bmlt",
  "bmlt-enabled/bread",
  "bmlt-enabled/crouton",
  "bmlt-enabled/fortyseven",
  "bmlt-enabled/lettuce",
  "bmlt-enabled/sdle",
  "bmlt-enabled/yap",
  "bmlt-enabled/yap-fbmessenger-bot",
];

module.exports = robot => {
  let github = require("githubot")(robot);

  robot.respond(/how can i help/i, msg => {
    const notFoundResponse = "I couldn't discover something automatically... I'm sure you could find something, if you ask a human.";
    let response = [];

    Promise.all(reposList.map(repo => {
      return new Promise((resolve, reject) => {
        github.get(`repos/${repo}/issues`, (issues) => {
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
};

function hasLabels(labels, name) {
  for (let label of labels) {
    if (label['name'] === name) {
      return true;
    }
  }

  return false;
}

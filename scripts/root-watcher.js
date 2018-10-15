// Description:
//   Watches root servers
//
// Dependencies:
//
//
// Configuration:
//
//
// Commands:
//
//
// Notes:
//
//
// Author:
//   radius314
let utils = require('./utils.js');
var cron = require('cron');

module.exports = robot => {
  new cron.CronJob({
    cronTime: '00 15 * * * *', // checks every 15 mins
    onTick: () => {
      sendRootStatus(robot, res => {
        if (res.length > 0) {
          robot.messageRoom("root-status", res.join("\n"));
        }
      });
    },
    start: true
  });

  robot.hear(/check the roots/i, msg => {
    msg.send("I'm checking the list of known roots...");
    sendRootStatus(msg, res => {
      msg.send(res.length > 0 ? res.join("\n") : `All roots are responding.`);
    });
  });
};

function sendRootStatus(msg, cb) {
  utils.requestGet(msg, "https://raw.githubusercontent.com/LittleGreenViper/BMLTTally/master/rootServerList.json", raw => {
    let roots = JSON.parse(raw);
    let response = [];
    Promise.all(roots.map(r => {
      return new Promise((resolve, reject) => {
        utils.requestGet(msg, `${r['rootURL']}/client_interface/json/?switcher=GetServerInfo`, (res, err) => {
          try {
            if (err !== null) throw new Error(err);
            let serverInfo = JSON.parse(res);
            if (serverInfo.length !== 1 || serverInfo[0]['version'] === "") {
              throw new Error("serverInfo is not in the expected format");
            }
          } catch (error) {
            response.push(`${r['name']} (${r['rootURL']}) has an issue.`);
          } finally {
            resolve();
          }
        });
      })
    })).then(() => {
      cb(response);
    });
  });
}

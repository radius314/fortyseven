// Description:
//   Tomato utilities
//
// Dependencies:
//
//
// Configuration:
//
//
// Commands:
//   hubot tomato last import - returns the time of the last sync
//   what region has <area> - returns the region a given area is in
//
// Notes:
// 
//
// Author:
//   radius314
var moment = require('moment');
var utils = require('./utils.js')

module.exports = robot => {
  var tomatoBaseUrl = 'https://tomato.na-bmlt.org';

  robot.respond(/tomato last import/i, msg => {
    utils.requestGet(robot,
      `${tomatoBaseUrl}/rest/v1/rootservers/?format=json`,
      res => {
        let maxTime = null;
        for (item of JSON.parse(res)) {
          if (maxTime == null || Date.parse(item['last_successful_import']) < maxTime) {
            maxTime = Date.parse(item['last_successful_import'])
          }
        }

        msg.send("The last 🍅 import was at: " + moment(maxTime).format("MMMM Do YYYY, h:mm:ss a") + " UTC");
      });
  });

  robot.hear(/what region (has|is) (.*[^\?])/i, msg => {
    let found = false;
    let match = msg.match[2];

    utils.requestGet(robot,
      `${tomatoBaseUrl}/main_server/client_interface/json/?switcher=GetServiceBodies`,
      res => {
        for (item of JSON.parse(res)) {
          if (item['type'] === 'AS'
            && item['name'].toLowerCase().indexOf(match.toLowerCase()) >= 0) {
            for (let parent of JSON.parse(res)) {
              if (parent['id'] === item['parent_id']) {
                msg.send(`🍅 says there is an area called ${item['name']} in ${parent['name']}.`);
                found = true;
              }
            }
          }
        }

        if (!found) msg.send(`🍅 has no idea what ${match} is.`);
      });
  });
};

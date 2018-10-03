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
//
// Notes:
// 
//
// Author:
//   radius314
var moment = require('moment');

module.exports = robot => {

  robot.respond(/tomato last import/, msg => {
    requestGet(robot,
      'https://tomato.na-bmlt.org/rest/v1/rootservers/?format=json',
      {
        'User-Agent' : '+fortyseven'
      },
      res => {
        var maxTime;
        for (item of JSON.parse(res)) {
          if (maxTime == null || Date.parse(item['last_successful_import']) < maxTime) {
            maxTime = Date.parse(item['last_successful_import'])
          }
        }

        msg.send("The last 🍅 import was at: " + moment(maxTime).format("MMMM Do YYYY, h:mm:ss a") + " UTC");
      });
  });

  var requestGet = (msg, url, headers, cb) => {
    msg
      .http(url)
      .headers(headers)
      .get()((err, res, body) => {
        cb(body);
      });
  };
};

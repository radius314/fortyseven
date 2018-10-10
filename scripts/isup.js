// Description:
// //Uses downforeveryoneorjustme.com to check if a site is up
//
// Dependencies:
//   None
//
// Configuration:
//   None
//
// Commands:
// hubot is <domain> up? - Checks if <domain> is up
//
// Author:
//   radius314

var utils = require('./utils.js');

module.exports = robot => {
  robot.respond(/is (?:http\:\/\/)?(.*?) (up|down)(\?)?/i, msg => {
    isUp(msg, msg.match[1], domain => {
      msg.send(domain)
    })
  })
};

let isUp = (msg, domain, cb) => {
  utils.requestGet(msg,
    `https://isitup.org/${domain}.json`,
    body => {
    res = JSON.parse(body);
    if (res.status_code === 1) {
      cb(`${res.domain} looks UP from here.`);
    } else if (res.status_code === 2) {
      cb(`${res.domain} looks DOWN from here.`);
    } else if (res.status_code === 3) {
      cb(`Are you sure ${res.domain} is a valid domain?`);
    } else {
      cb(`Not sure ${res.domain} returned an error.`);
    }
  });
};

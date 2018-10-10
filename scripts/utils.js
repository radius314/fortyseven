exports.requestGet = (msg, url, cb) => {
  msg
    .http(url)
    .headers({
      'User-Agent': '+fortyseven'
    })
    .get()((err, res, body) => {
      cb(body);
    });
};

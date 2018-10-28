exports.requestGet = (msg, url, cb) => {
  msg
    .http(url)
    .headers({
      'User-Agent': '+fortyseven'
    })
    .get()((err, res, body) => {
      cb(body, err);
    });
};

exports.requestPost = (msg, url, data, cb) => {
  msg
    .http(url)
    .headers({
      'User-Agent': '+fortyseven',
      'Content-Type': 'application/json'
    })
    .post(JSON.stringify(data))((err, res, body) => {
      cb != null ? cb(body, err) : void 0;
    });
};

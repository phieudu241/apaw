const http = require('http');

function makeRequest(parameters) {
  const {
    corsHost,
    authorization,
    headers,
    host,
    path,
    payload,
  } = parameters;

  const requestHost = corsHost || host;
  const requestPath = corsHost ? `/http://${host}${path}` : path;

  const options = {
    headers,
    path: requestPath,
    hostname: requestHost,
    port: 80,
    method: 'POST',
  };

  headers.Authorization = authorization;

  return new Promise((resolve, reject) => {
    const resBuffer = [];
    const req = http.request(options, (res) => {
      res.on('data', (d) => resBuffer.push(d));
      res.on('error', (err) => reject(err));
      res.on('end', () => resolve({
        data: resBuffer.join(''),
        headers: res.headers,
        status: res.statusCode,
      }));
    });
    req.write(JSON.stringify(payload));
    req.end();
  });
}

module.exports = makeRequest;

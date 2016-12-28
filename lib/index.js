'use strict';

const mapRouteToString = req => {
  const method = Object.keys(req.route.methods)[0];
  const route = req.route.path;
  return `${method}|${route}`;
};

function expressBatching() {
  const queues = {};
  const cache = {};

  return function middleware(hashFunc) {
    hashFunc = hashFunc ? hashFunc : () => 'default';
    return function Register(req, res, next) {
      const route = mapRouteToString(req);
      const key = hashFunc(req);
      const cached = cache[item];

      next();
    };

  };

};

module.exorts = ExpressBatching;

//usage
const expressBatching = expressBatching();
app.get('/', expressBatching(req => req.body._id), (req, res) => res.send({}));


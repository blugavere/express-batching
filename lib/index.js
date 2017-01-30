'use strict';

// const chalk = require('chalk');

const mapRouteToString = req => {
  const method = Object.keys(req.route.methods)[0];
  const route = req.route.path;
  return `${method}|${route}`;
};

function expressBatching(hashFunc, ctrlMethod) {
  if (!ctrlMethod) {
    ctrlMethod = hashFunc;
    hashFunc = () => '';
    if (!ctrlMethod) {
      throw new Error('Controller Method is required.');
    }
  }

  const queues = {};
  const cache = {};

  return (req, res) => {
    const url = mapRouteToString(req);
    const key = `${url}|${hashFunc(req)}`;
    // console.log(chalk.bold(chalk.green('Hash Key:', key)));
    const cached = cache[key];

    if (cached) {
      // console.log('Resolving from cache!');
      return process.nextTick(() => res.send(cached));
    }

    if (queues[key]) {
      // console.log(chalk.yellow(`queueing a request into ${key}`));
      return queues[key].push(res);
    }

    // console.log('creating a queue', key);
    queues[key] = [res];

    const applyToQueue = (key, func) => {
      const queue = queues[key];
      queue.forEach(func);
    };

    const mockRes = {
      status(num) {
        // console.log(`res.status called with ${num}. Applying to queue...`);
        applyToQueue(key, responseObj => {
          responseObj.status(num);
        });
      },
      send(result) {
        // console.log('Resolving Das Queue! and caching!');
        // console.log(chalk.yellow(`Caching ${key}`));
        cache[key] = result;
        setTimeout(() => {
          // console.log(chalk.yellow(`Clearing cache for ${key}...`));
          delete cache[key];
        }, 5 * 1000); // 5 seconds

        const queue = queues[key];
        queue.forEach(responseObj => {
          // console.log('Resolving from queue!');
          responseObj.send(result);
        });
        // clear queue
        delete queues[key];
      }
    };

    ctrlMethod(req, mockRes);
  };
}

module.exports = expressBatching;

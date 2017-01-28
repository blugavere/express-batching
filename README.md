# express-batching [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage Status](https://coveralls.io/repos/github/blugavere/express-batching/badge.svg?branch=master)](https://coveralls.io/github/blugavere/express-batching?branch=master)[![NPM Downloads](https://img.shields.io/npm/dm/express-batching.svg?style=flat)](https://www.npmjs.com/package/express-batching)[![Patreon](https://img.shields.io/badge/patreon-support%20the%20author-blue.svg)](https://www.patreon.com/blugavere)

> A small higher order component for in-process batching and caching of API requests

## Installation

```sh
$ npm install --save express-batching
```

## Usage

```js
const expressBatching = require('express-batching');
const app = require('express')();
const catRoutes = require('./catRoutes');

// normal
app.get('/cats', catRoutes.findAll);

// with batching
app.get('/cats', expressBatching(catRoutes.findAll));

// accepting a hash function for parameterized requests
app.get('/cats/:id', expressBatching(req => req.params.id, catRoutes.findOne));

```

## Contributing

Contribute!

### TODOs
In order of importance

- get a cool logo
- optimize perf
- config param 
  - cache timeout
  - max queue size
- setter injection for alternative cache (redis)
- moar tests

## Testing

```bash
mocha --require clarify lib/index.test.js --watch
```

## License

Apache-2.0 © [blugavere](http://benlugavere.com)


[npm-image]: https://badge.fury.io/js/express-batching.svg
[npm-url]: https://npmjs.org/package/express-batching
[travis-image]: https://travis-ci.org/blugavere/express-batching.svg?branch=master
[travis-url]: https://travis-ci.org/blugavere/express-batching
[daviddm-image]: https://david-dm.org/blugavere/express-batching.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/blugavere/express-batching
[coveralls-image]: https://coveralls.io/repos/blugavere/express-batching/badge.svg
[coveralls-url]: https://coveralls.io/r/blugavere/express-batching

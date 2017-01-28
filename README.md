# express-batching [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage Status](https://coveralls.io/repos/github/blugavere/express-batching/badge.svg?branch=master)](https://coveralls.io/github/blugavere/express-batching?branch=master)

> A small middleware module for batching and caching API requests

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

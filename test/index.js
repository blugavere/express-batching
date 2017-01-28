
'use strict';

const path = require('path');
const expect = require('expect');
const sinon = require('sinon');
const express = require('express');

const request = require('superagent');
const expressBatching = require('../lib');

const mock = {
};

/**
* mocha --require clarify express-batching/test --watch
* istanbul cover --print both node_modules/.bin/_mocha -- express-batching/test/index.js
* eslint ./path/to/file.test.js --watch
*/

describe(path.basename(__filename).replace('.test.js', ''), () => {
  let sandbox;

  before(() => {

  });

  after(() => {

  });

  describe('units', () => {
    let app;
    beforeEach(() => {
      sandbox = sinon.sandbox.create();
      app = express();
      app.get('/foo', (req, res) => {
        res.send({name: 'foo'});
      });
      app.get('/bar', (req, res) => {
        setTimeout(() => {
          res.send({name: 'bar'});
        }, 3000);
      });
      app.listen(3000, () => {
        console.log('app listening on port 3000!');
      });

    afterEach(() => {
      sandbox.restore();
      app.close();
    });
  });

  it('should pass', () => {
    expect(true).toBe(true);
  });

  it('should also pass', done => {
    request
      .get('http://localhost:3000/')
      .set('Accept', 'application/json')
      .end(function (err, res) {
        console.log(res.body);
        expect(res.body.color).toBe('blue');
        done();
      });
  });
});

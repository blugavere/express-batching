
'use strict';

const path = require('path');
const expect = require('expect');
const sinon = require('sinon');
const express = require('express');
const bodyParser = require('body-parser');
const request = require('superagent');
const expressBatching = require('./index');

const mock = {
  noop() {}
};

/**
* mocha --require clarify lib/index.test.js --watch
* istanbul cover --print both node_modules/.bin/_mocha -- lib/index.test.js --watch
* eslint ./path/to/file.test.js --watch
*/

describe(path.basename(__filename).replace('.test.js', ''), () => {
  let sandbox;

  describe('endpoint tests', () => {
    let app;
    let server;
    beforeEach(() => {
      sandbox = sinon.sandbox.create();
      app = express();
      app.use(bodyParser.json());
      sandbox.stub(mock);
      app.get('/foo', (req, res) => {
        // console.log(req);
        res.status(203);
        res.send({name: 'foo'});
      });
      app.get('/bar', (req, res) => {
        setTimeout(() => {
          res.status(203);
          res.send({name: 'bar'});
        }, 500);
      });
      app.get('/baz', expressBatching((req, res) => {
        setTimeout(() => {
          mock.noop();
          res.status(203);
          res.send({name: 'baz'});
        }, 1000);
      }));
      app.post('/barry/:id', expressBatching(req => req.params.id, (req, res) => {
        setTimeout(() => {
          mock.noop();
          res.status(201);
          res.send({name: 'barry'});
        }, 1000);
      }));
      server = app.listen(3000);
    });

    describe('endpoint test', () => {
      it('should hit a regular api just fine', done => {
        request
          .get('http://localhost:3000/foo')
          .end((err, res) => {
            // console.log('APi Returning: ', res.body);
            expect(res.body.name).toBe('foo');
            done();
          });
      });

      it('should hit a cache api just fine as well', function (done) {
        this.timeout(3000);
        request
          .get('http://localhost:3000/baz')
          .end((err, res) => {
            // console.log('APi Returning: ', res.body);
            expect(mock.noop.calledOnce).toBe(true);
            expect(res.body.name).toBe('baz');
            done();
          });
      });

      it('should hit a cache api just fine as well', function (done) {
        this.timeout(10000);
        const createReq = () => { // num param for logs
          // console.log(`Req #${num} created.`);
          request
            .get('http://localhost:3000/baz')
            .end((err, res) => {
              // console.log(`Req #${num} returned.`, res.body);
              expect(res.status).toEqual(203);
              expect(res.body.name).toBe('baz');
            });
        };

        for (let i = 0; i < 10; i++) {
          createReq(i);
        }

        request
          .get('http://localhost:3000/baz')
          .end((err, res) => {
            // console.log('Api Returning: ', res.body);
            // expect(mock.noop.calledOnce).toBe(true);
            expect(res.body.name).toBe('baz');
            request
            .get('http://localhost:3000/baz')
            .end((err, res) => {
              // console.log('Cache Return: ', res.body);
              expect(mock.noop.calledOnce).toBe(true);
              expect(res.body.name).toBe('baz');
              done();
            });
          });
      });

      it('should hit a cache api just fine as well', function (done) {
        this.timeout(10000);

        request
          .post('http://localhost:3000/barry/foo')
          .end((err, res) => {
            // console.log('Api Returning: ', res.body);
            expect(mock.noop.calledOnce).toBe(true);
            expect(res.body.name).toBe('barry');
            expect(res.status).toEqual(201);
            done();
          });
      });
    });

    afterEach(() => {
      sandbox.restore();
      server.close();
    });
  });
});

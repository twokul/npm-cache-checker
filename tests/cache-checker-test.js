'use strict';

var assert       = require('chai').assert;
var CacheChecker = require('../lib/cache-checker');
var cacheChecker;

var ok    = assert.ok;
var equal = assert.equal;

describe('CacheChecker', function() {
  afterEach(function() {
    cacheChecker = null;
  });

  it('exists', function() {
    ok(CacheChecker);
  });

  it('should return a promise', function() {
    cacheChecker = new CacheChecker();

    equal(typeof cacheChecker.then, 'function', 'returns a promise');
  });

  it('rejects if `package.json` file was not found', function(done) {
    cacheChecker = new CacheChecker('foo/bar/package.json');

    return cacheChecker.then(function(result) {
      ok(!result);
      done();
    });
  });

  it('rejects if at least one of the packages fails cache check', function(done) {
    cacheChecker = new CacheChecker('/tests/fixtures/package.json', '/tests/fixtures/npm-cache-incomplete/');

    return cacheChecker.then(function(result) {
      ok(!result);
      done();
    });
  });

  it('resolves with true if cache for all the packages exists', function(done) {
    cacheChecker = new CacheChecker('/tests/fixtures/package.json', '/tests/fixtures/npm-cache-complete/');

    return cacheChecker.then(function(result) {
      ok(result);
      done();
    });
  });
});

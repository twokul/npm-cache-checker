'use strict';

var RSVP = require('rsvp');
var path = require('path');

function exists(path) {
  var fs = require('fs');

  try {
    return fs.existsSync(path);
  } catch(e) {
    return false;
  }
}

function dirExists(path) {
  var fs = require('fs');

  try {
    return fs.lstatSync(path).isDirectory();
  } catch(e) {
    return false;
  }
}

function npmCachePathFor() {
  var os        = require('os');
  var platform = os.platform();

  switch(platform) {
    case 'darwin':
      return path.join(process.env.HOME, '/.npm');
    case 'win32':
      return '%AppData%/npm-cache';
  }
}

function cacheFor(name, npmCachePath) {
  return dirExists(path.join(npmCachePath, name));
}

function getPackages(path) {
  var deps = require(path).dependencies;

  return (deps) ? Object.keys(deps) : [];
}

function CacheChecker(/*packageJsonPath, npmCachePath*/) {
  var cacheChecker = this;

  cacheChecker._init.apply(this, arguments);

  return new RSVP.Promise(function(resolve) {
    var fileExists = exists(cacheChecker._packageJsonPath);

    if (!fileExists) {
      resolve(false);
    }

    var packages = getPackages(cacheChecker._packageJsonPath);

    var result = packages.every(function(name) {
      return cacheFor(name, cacheChecker._npmCachePath);
    });

    resolve(result);
  });
}

CacheChecker.prototype._init = function(packageJsonPath, npmCachePath) {
  if (packageJsonPath) {
    this._packageJsonPath = path.join(process.cwd() + packageJsonPath);
  } else {
    this._packageJsonPath = path.join(process.cwd(), 'package.json');
  }

  if (!npmCachePath) {
    this._npmCachePath = npmCachePathFor();
  } else {
    this._npmCachePath = path.join(process.cwd(), npmCachePath);
  }
};

module.exports = CacheChecker;

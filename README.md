## Npm cache checker

Simple Promise-based utility to check if npm packages are cached.

Example below will grab `dependencies` from `package.json` and
check if those packages are cached.

```javascript
var cacheChecker = new CacheChecker();

cacheChecker.then(function(result) {
  // result is true or false
});
```

Optionally, you can point to `package.json` of your choosing.

```javascript
var cacheChecker = new CacheChecker('path/to/package.json');

cacheChecker.then(function(result) {
  // result is true or false
});
```

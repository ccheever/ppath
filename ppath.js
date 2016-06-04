#!/usr/bin/env node

var path = require('path');

function getUserHome() {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

function stringStartsWith (string, prefix) {
  return string.slice(0, prefix.length) == prefix;
}

function computePrettyPath(p, opts) {
  var pp;
  opts = opts || {};

  if (p) {
    pp = path.resolve(p);
  } else {
    pp = path.resolve(process.cwd());
  }
  var home = getUserHome();

  for (var v in process.env) {
    var rw = process.env[v];
    if (!rw) {
      continue;
    }

    switch (v) {
      case 'HOME':
      case 'OLDPWD':
      case 'PWD':
        break;

      default:
        if (stringStartsWith(pp, rw)) {
          pp = '$' + v + pp.slice(rw.length);
        }
        break;
    }
  }

  if (stringStartsWith(pp, home)) {
    if (opts.dontUseTilde) {
      pp = '$HOME' + pp.slice(home.length);
    } else {
      pp = '~' + pp.slice(home.length);
    }
  }

  return pp;

}

module.exports = computePrettyPath;

if (require.main === module) {
  var arg = process.argv[2] || '.';
  console.log(computePrettyPath(arg));
}

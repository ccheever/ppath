#!/usr/bin/env node

function getUserHome() {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

function stringStartsWith (string, prefix) {
  return string.slice(0, prefix.length) == prefix;
}


var cwd = process.cwd();
var home = getUserHome();
var p = cwd;

for (var v in process.env) {
  var rw = process.env[v];
  switch (v) {
    case 'HOME':
    case 'OLDPWD':
    case 'PWD':
      break;

    default:
      if (stringStartsWith(p, rw)) {
        p = '$' + v + p.slice(rw.length);
      }
      break;
  }
}

if (stringStartsWith(p, home)) {
  p = '~' + p.slice(home.length);
}

console.log(p);


#!/usr/bin/env node

let path = require('path');

function getUserHome() {
  return process.env[process.platform == 'win32' ? 'USERPROFILE' : 'HOME'];
}

function stringStartsWith(string, prefix) {
  return string.slice(0, prefix.length) == prefix;
}

function ppath(p, opts) {
  let pp;
  opts = opts || {
    envvars: true,
    tilde: true,
  };

  if (p) {
    pp = path.resolve(p);
  } else {
    pp = path.resolve(process.cwd());
  }
  let home = getUserHome();

  let longestMatchLength = 0;
  let matchKey = null;
  let matchVal = null;
  for (var v in process.env) {
    let rw = process.env[v];
    if (!rw) {
      continue;
    }

    if (rw.length <= longestMatchLength) {
      continue;
    }

    switch (v) {
      case 'HOME':
      case 'OLDPWD':
      case 'PWD':
        break;

      default:
        if (stringStartsWith(pp, rw)) {
          longestMatchLength = rw.length;
          matchVal = rw;
          matchKey = v;
        }
        break;
    }
  }

  if (longestMatchLength > 0) {
    if (opts.envvars) {
      pp = '$' + matchKey + pp.slice(matchVal.length);
    }
  }

  if (stringStartsWith(pp, home)) {
    if (opts.tilde) {
      pp = '~' + pp.slice(home.length);
    } else {
      if (opts.envvars) {
        pp = '$HOME' + pp.slice(home.length);
      }
    }
  }

  return pp;
}

function printHelp() {
  console.log(`Pretty prints the paths of files

Usage: ppath [options] [paths]

Options:
  -h, --help         Display this help message
  -v, --version      Display the version
  -n                 Don't substitute environment variables
  -t                 Don't substitute ~ for the user's home directory
  -f, --full         No substitutions, just the explicit absolute path
`);
}

function main() {
  let minimist = require('minimist');
  let args = minimist(process.argv.slice(2), {
    boolean: ['n', 't', 'f', 'full'],
    alias: { n: 'no_envvars', t: 'no_tilde', h: 'help', f: 'full', v: 'version' },
  });

  if (args.help) {
    printHelp();
    return;
  }

  if (args.version) {
    let pkg = require('./package');
    console.log(pkg.version || '?');
    return;
  }

  let envvars = true;
  let tilde = true;

  if (args.full) {
    envvars = !args.full;
    tilde = !args.full;
  } else {
    envvars = !args.no_envvars;
    tilde = !args.no_tilde;
  }

  for (let p of args._) {
    console.log(ppath(p, { envvars, tilde }));
  }
}

if (require.main === module) {
  main();
}

module.exports = ppath;

'use strict';

jest.unmock('path');

jest.unmock('../ppath');

let path = require('path');

let ppath = require('../ppath');

function getUserHome() {
  return process.env[process.platform == 'win32' ? 'USERPROFILE' : 'HOME'];
}

describe('Basic Usage', function() {
  it("Returns the same path for something that can't be easily shortened", function() {
    expect(ppath('/asldfhsdf/1dwdadasd')).toBe('/asldfhsdf/1dwdadasd');
  });

  it('Substitutes a squiggle for your homedir', function() {
    expect(ppath(getUserHome() + '/projects')).toBe('~/projects');
  });

  it('Strips trailing slashes except for a single slash', function() {
    expect(ppath('/var/tmp/')).toBe('/var/tmp');
  });

  it("Doesn't strip a single slash", function() {
    expect(ppath('/')).toBe('/');
  });

  process.env.PPATH_TEST_DIR = __dirname;
  it('Does $ replacement for env vars', function() {
    expect(ppath(__filename)).toBe('$PPATH_TEST_DIR/' + path.basename(__filename));
  });

  process.env.VAR = '/PPATH_TEST_DIR/var';
  process.env.TMP = '/PPATH_TEST_DIR/var/tmp';
  it('Matches the longest thing if multiple things match', function() {
    expect(ppath('/PPATH_TEST_DIR/var/tmp/some_file')).toBe('$TMP/some_file');
  });
});

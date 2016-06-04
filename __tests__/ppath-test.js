'use strict';

jest.unmock('path');

jest.unmock('../ppath');

var path = require('path');

var prettyPath = require('../ppath');

function getUserHome() {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

describe('Basic Usage', function () {
  it("Returns the same path for something that can't be easily shortened", function () {
    expect(prettyPath('/asldfhsdf/1dwdadasd')).toBe('/asldfhsdf/1dwdadasd');
  });

  it("Substitutes a squiggle for your homedir", function () {
    expect(prettyPath(getUserHome() + '/projects')).toBe('~/projects');
  });

  it("Strips trailing slashes except for a single slash", function () {
    expect(prettyPath('/var/tmp/')).toBe('/var/tmp');
  });

  it("Doesn't strip a single slash", function () {
    expect(prettyPath('/')).toBe('/');
  });

  process.env.PPATH_TEST_DIR = __dirname;
  it("Does $ replacement for env vars", function () {
    expect(prettyPath(__filename)).toBe('$PPATH_TEST_DIR/' + path.basename(__filename));
  });

});

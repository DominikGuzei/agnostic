global.sinon = require("sinon");
global.chai = require("chai");
global.should = require("chai").should();
global.expect = require("chai").expect;
global.AssertionError = require("chai").AssertionError;

global.swallow = function (thrower) {
    try {
        thrower();
    } catch (e) { }
};

global.agnosticFilePath = '../src/agnostic';

global.invalidateRequireCacheFor = function(filePath) {
  delete require.cache[require.resolve(filePath)]; // invalidate require cache
};

var sinonChai = require("sinon-chai");
chai.use(sinonChai);
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

global.agnosticFilePath = '../../src/agnostic/agnostic';

global.invalidateRequireCacheFor = function(filePath) {
  delete require.cache[require.resolve(filePath)]; // invalidate require cache
};

global.Class = require('../../src/Class').Class;
global.Interface = require('../../src/Interface').Interface;

global.agnostic = {

	injection: {
		SingletonProvider: require('../../src/agnostic/injection/SingletonProvider').SingletonProvider,
		InjectionMapping: require('../../src/agnostic/injection/InjectionMapping').InjectionMapping,
		Injector: require('../../src/agnostic/injection/Injector').Injector,
	}

};

var sinonChai = require("sinon-chai");
chai.use(sinonChai);
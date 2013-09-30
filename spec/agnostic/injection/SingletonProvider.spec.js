"use strict";

var Class = require('../../../src/Class').Class;

var SingletonProvider = require('../../../src/agnostic/injection/SingletonProvider').SingletonProvider;

describe('agnostic.injection.SingletonProvider:', function(){

  describe('initializing singleton provider with a class type', function() {

    beforeEach(function() {
      this.TestClass = Class({});
      this.singletonProvider = new SingletonProvider(this.TestClass);
    });

    it('returns the correct type when asked', function() {
      expect(this.singletonProvider.getType()).to.equal(this.TestClass);
    });

    it('provides instance of the configured class type', function() {
      var instance = this.singletonProvider.provideInstance();

      expect(instance).to.be.instanceof(this.TestClass);
    });

    it('provides a single instance of the class type for each request', function() {
      var firstInstance = this.singletonProvider.provideInstance();
      var secondInstance = this.singletonProvider.provideInstance();

      expect(firstInstance).to.equal(secondInstance);
    });

  });

});
"use strict";

describe('agnostic.injection.InjectionMapping:', function(){

  var InjectionMapping = agnostic.injection.InjectionMapping;
  var SingletonProvider = agnostic.injection.SingletonProvider;

  describe('Use Case: map to singleton provider,', function() {

  	beforeEach(function() {
				this.TestInterface = Interface('TestInterface', {}, true);
  			this.TestClass = Class('TestClass', {}, true);

  			this.injectionMapping = new InjectionMapping(this.TestInterface).toSingleton(this.TestClass);

  			this.dependencyProvider = this.injectionMapping.getProvider();
  	});

  	it('uses a singleton provider for the mapping', function() {
  		expect(this.dependencyProvider).to.be.instanceof(SingletonProvider);
  	});

  	it('configures request type correctly', function() {
  		expect(this.injectionMapping.getRequestType()).to.equal(this.TestInterface);
  	});

  	it('configures response type correctly', function() {
  		expect(this.injectionMapping.getResponseType()).to.equal(this.TestClass);
  	});

  	it('configures the singleton provider with the correct class', function() {
  		expect(this.dependencyProvider.getType()).to.equal(this.TestClass);
  	});

  	it('returns an instance of the response type', function() {
  		expect(this.injectionMapping.getInstance()).to.be.instanceof(this.TestClass);
  	})

  });

});
"use strict";

var Injector = require('../src/agnostic/Injector').Injector;
var Class = require('../src/Class').Class;
var Interface = require('../src/Interface').Interface;
var Faker = require('Faker')

describe('agnostic.Injector:', function(){

  describe('Use Case: map to singleton,', function() {

    beforeEach(function() {
      this.TestInterface = Interface('TestInterface', {});
      this.TestClass = Class('TestClass', {});

      this.injector = new Injector();
    });

    it('maps given interface to a single instance of given class', function() {

      var Injectee1 = Class({
        Dependencies: {
          testInterfaceInstance: this.TestInterface
        }
      });

      var injectee1 = new Injectee1();

      var Injectee2 = Class({
        Dependencies: {
          blaBlub: this.TestInterface
        }
      });

      var injectee2 = new Injectee2();

      this.injector.map(this.TestInterface).toSingleton(this.TestClass);
      this.injector.injectInto(injectee1);
      this.injector.injectInto(injectee2);

      expect(injectee1.testInterfaceInstance).to.be.instanceof(this.TestClass);
      expect(injectee2.blaBlub).to.be.equal(injectee1.testInterfaceInstance);

    });

  });

});

/*
describe('agnostic.Injector', function(){

  beforeEach(function() {
    this.Injector = agnostic.Injector;
  });

  it('is defined on the agnostic namespace', function() {
    expect(this.Injector).to.exist;
  });

  describe('allows to register and retrieve implementations for named interfaces', function() {

    describe('Throws understandable errors when used in the wrong way:', function() {

      it('throws an error if no interface name is given.', function() {
        expect( this.Injector.get ).to.throw(TypeError);
      });

      it('throws a type error if the interface name is not of type string.', function() {
        var Injector = this.Injector;

        function callGetWithObject() { Injector.get({}); }
        function callGetWithNumber() { Injector.get(1); }
        function callGetWithArray() { Injector.get([]); }

        expect( callGetWithObject ).to.throw(TypeError);
        expect( callGetWithNumber ).to.throw(TypeError);
        expect( callGetWithArray ).to.throw(TypeError);
      });

      it('throws an error if the given interface was never registered.', function() {
        var Injector = this.Injector,
            fakeInterfaceName = Faker.random.bs_noun() + 'Interface';

        function callGetWithNonExistingInterface() { Injector.get(fakeInterfaceName); }

        var expectedErrorMessage = "No implementation found for interface '" + fakeInterfaceName + "'";
        expect( callGetWithNonExistingInterface ).to.throw(expectedErrorMessage);
      });

    });

    describe('Returns the right implementations when used correctly:', function() {

      it('returns the registered implementation of an interface.', function() {
        var interfaceName = 'TestInterface',
            registeredImplementation = {};

        this.Injector.register(interfaceName, registeredImplementation);
        var returnedImplementation = this.Injector.get(interfaceName);

        expect(returnedImplementation).to.equal(registeredImplementation);
      });

      it('allows to register and retrieve multiple interfaces.', function() {
        var interfaceOneName = 'InterfaceOne',
            interfaceOneImplementation = { one: true },
            interfaceTwoName = 'InterfaceTwo',
            interfaceTwoImplementation = { two: true };

        this.Injector.register(interfaceOneName, interfaceOneImplementation);
        this.Injector.register(interfaceTwoName, interfaceTwoImplementation);

        var returnedImplementationOne = this.Injector.get(interfaceOneName);
        var returnedImplementationTwo = this.Injector.get(interfaceTwoName);

        expect(returnedImplementationOne).to.equal(interfaceOneImplementation);
        expect(returnedImplementationTwo).to.equal(interfaceTwoImplementation);
      });

    });

  });

});
*/

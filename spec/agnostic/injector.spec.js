"use strict";

var agnostic = require('../../built/agnostic.min');
var Faker = require('Faker')

describe('agnostic.Injector', function(){

  beforeEach(function() {
    this.Injector = agnostic.Injector;
  });

  it('is defined on the agnostic namespace', function() {
    expect(this.Injector).to.exist;
  });

  describe('allows to register and retrieve implementations for named interfaces', function() {

    describe('throws understandable errors when used in the wrong way', function() {

      it('throws an error if no interface name is given', function() {
        expect( this.Injector.get ).to.throw(TypeError);
      });

      it('throws a type error if the interface name is not of type string', function() {
        var Injector = this.Injector;

        function callGetWithObject() { Injector.get({}); }
        function callGetWithNumber() { Injector.get(1); }
        function callGetWithArray() { Injector.get([]); }

        expect( callGetWithObject ).to.throw(TypeError);
        expect( callGetWithNumber ).to.throw(TypeError);
        expect( callGetWithArray ).to.throw(TypeError);
      });

      it('throws an error if the given interface was never registered', function() {
        var Injector = this.Injector,
            fakeInterfaceName = Faker.random.bs_noun() + 'Interface';

        function callGetWithNonExistingInterface() { Injector.get(fakeInterfaceName); }

        var expectedErrorMessage = "No implementation found for interface '" + fakeInterfaceName + "'";
        expect( callGetWithNonExistingInterface ).to.throw(expectedErrorMessage);
      });

    });

    describe('returns the correct implementations when used correctly', function() {

      it('returns the registered implementation of an interface', function() {
        var interfaceName = 'TestInterface',
            registeredImplementation = {};

        this.Injector.register(interfaceName, registeredImplementation);
        var returnedImplementation = this.Injector.get(interfaceName);

        expect(returnedImplementation).to.equal(registeredImplementation);
      });

      it('allows to register and retrieve multiple interfaces', function() {
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

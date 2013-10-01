"use strict";

var Injector = agnostic.injection.Injector;

describe('agnostic.Injector:', function(){

  beforeEach(function() {
    this.TestInterface = Interface('TestInterface', {}, true);
    this.TestClass = Class('TestClass', {}, true);

    this.InjecteeClass1 = Class('InjecteeClass1', {
      Dependencies: {
        testInterfaceInstance: this.TestInterface
      }
    }, true);

    this.InjecteeClass2 = Class('InjecteeClass2', {
      Dependencies: {
        testInterfaceInstance: this.TestInterface,
        injectee1Instance: this.InjecteeClass1
      }
    }, true);

    this.injector = new Injector();
  });

  it('handles multiple injection points correctly', function() {
      
    var injectee = new this.InjecteeClass2();

    this.injector.map(this.TestInterface).toSingleton(this.TestClass);
    this.injector.map(this.InjecteeClass1).toSingleton(this.InjecteeClass1);

    this.injector.injectInto(injectee);

    expect(injectee.testInterfaceInstance).to.be.instanceof(this.TestClass);
    expect(injectee.injectee1Instance).to.be.instanceof(this.InjecteeClass1);

  });

  it('injects into mapped dependencies', function() {

    var injectee = new this.InjecteeClass2();

    this.injector.map(this.TestInterface).toSingleton(this.TestClass);
    this.injector.map(this.InjecteeClass1).toSingleton(this.InjecteeClass1);

    this.injector.injectInto(injectee);

    expect(injectee.injectee1Instance.testInterfaceInstance).to.be.instanceof(this.TestClass);

  });

  it('throws an error when required dependency was not configured', function() {

    var injectee = new this.InjecteeClass2(),
        that = this;

    this.injector.map(this.TestInterface).toSingleton(this.TestClass);

    function injectWhileDependencyIsNotMapped() {
      that.injector.injectInto(injectee);
    }
    
    expect(injectWhileDependencyIsNotMapped).to.throw(Error);
  });

  describe('Use Case: map to singleton,', function() {

    it('maps given interface to a single instance of given class', function() {

      var injectee1 = new this.InjecteeClass1();
      var injectee2 = new this.InjecteeClass1();

      this.injector.map(this.TestInterface).toSingleton(this.TestClass);
      this.injector.injectInto(injectee1);
      this.injector.injectInto(injectee2);

      expect(injectee1.testInterfaceInstance).to.be.instanceof(this.TestClass);
      expect(injectee2.testInterfaceInstance).to.be.equal(injectee1.testInterfaceInstance);

    });

  });

});

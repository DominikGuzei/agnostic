"use strict";

var Injector = agnostic.injection.Injector;

describe('agnostic.Injector:', function(){

  beforeEach(function() {
    this.TestInterface = Interface('TestInterface', {}, true);
    this.TestClass = Class('TestClass', {}, true);

    this.InjecteeClass1 = Class('InjecteeClass1', {
      Dependencies: {
        testInstance: this.TestInterface
      }
    }, true);

    this.InjecteeClass2 = Class('InjecteeClass2', {
      Dependencies: {
        testInstance: this.TestInterface,
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

    expect(injectee.testInstance).to.be.instanceof(this.TestClass);
    expect(injectee.injectee1Instance).to.be.instanceof(this.InjecteeClass1);

  });

  it('injects into mapped dependencies', function() {

    var injectee = new this.InjecteeClass2();

    this.injector.map(this.TestInterface).toSingleton(this.TestClass);
    this.injector.map(this.InjecteeClass1).toSingleton(this.InjecteeClass1);

    this.injector.injectInto(injectee);

    expect(injectee.injectee1Instance.testInstance).to.be.instanceof(this.TestClass);

  });

  it('handles circular dependencies correctly', function() {

    var CircularDependency1 = Class('CircularDependency1', {}, true);
    var CircularDependency2 = Class('CircularDependency2', {}, true);

    Class.extend(CircularDependency1, {
      Dependencies: {
        circularInstance2: CircularDependency2
      }
    });

    Class.extend(CircularDependency2, {
      Dependencies: {
        circularInstance1: CircularDependency1
      }
    });

    this.injector.map(CircularDependency1).asSingleton();
    this.injector.map(CircularDependency2).asSingleton();

    var circularInstance1 = this.injector.getInstanceFor(CircularDependency1);
    var circularInstance2 = this.injector.getInstanceFor(CircularDependency2);

    expect(circularInstance1.circularInstance2).to.equal(circularInstance2);
    expect(circularInstance2.circularInstance1).to.equal(circularInstance1);

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

      expect(injectee1.testInstance).to.be.instanceof(this.TestClass);
      expect(injectee2.testInstance).to.be.equal(injectee1.testInstance);

    });

  });

  describe('Use Case: map class as singleton,', function() {

    beforeEach(function() {

      this.InjecteeWithSingletonClassDependency = Class('InjecteeWithSingletonClassDependency', {
        Dependencies: {
          testInstance: this.TestClass
        }
      }, true);

    });

    it('maps given class to a single instance of it', function() {

      var injectee1 = new this.InjecteeWithSingletonClassDependency();
      var injectee2 = new this.InjecteeWithSingletonClassDependency();

      this.injector.map(this.TestClass).asSingleton();
      this.injector.injectInto(injectee1);
      this.injector.injectInto(injectee2);

      expect(injectee1.testInstance).to.be.instanceof(this.TestClass);
      expect(injectee2.testInstance).to.be.equal(injectee1.testInstance);

    });

  });

});

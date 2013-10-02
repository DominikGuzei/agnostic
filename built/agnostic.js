(function (globalNamespace) {
  "use strict";

  function applyMethodName(method, name) {
    method.toString = function () { return name; };
  }

  function applyConstructorName(NewClass, name) {
    NewClass.toString = function () { return name; };
  }

  function applyClassNameToPrototype(NewClass, name) {
    NewClass.prototype.toString = function () { return name; };
  }

  /**
   * Creates and returns a new JavaScript 'class' as constructor function.
   *
   * @param {String} classPath Namespaces and class name separated by '.'
   * @param {Object} classDefinition Properties and methods that are added to the prototype
   *
   * @returns {function()} constructor The constructor of the created class
   * @expose
   */
  var Class = function (classPath, classDefinition, local) {
    var SuperClass, implementations, NewClass;

    if(typeof classPath !== 'string') {
      throw new Error('Please give your class a name. Pass "true" as last parameter to avoid global namespace pollution');
    }

    SuperClass = classDefinition['Extends'] || null;
    delete classDefinition['Extends'];

    implementations = classDefinition['Implements'] || null;
    delete classDefinition['Implements'];

    NewClass = classDefinition['initialize'] || null;
    delete classDefinition['initialize'];

    if (!NewClass) {
      if (SuperClass) {
        // invoke constructor of superclass by default
        NewClass = function () { SuperClass.apply(this, arguments); };
      } else {
        // there is no super class, default constructor is no-op method
        NewClass = function () {};
      }
    }

    applyConstructorName(NewClass, classPath);

    Class['inherit'](NewClass, SuperClass);

    Class['implement'](NewClass, implementations);

    applyClassNameToPrototype(NewClass, classPath);

    Class['extend'](NewClass, classDefinition, true);

    if(!local) {
      Class['namespace'](classPath, NewClass);
    }

    return NewClass;
  };

  /**
   * Adds all properties of the extension object to the target object. 
   * Can be configured to override existing properties.
   * 
   * @param  {Object} target
   * @param  {Object} extension
   * @param  {boolean} shouldOverride
   * @return {undefined}
   */
  Class['augment'] = function (target, extension, shouldOverride) {

    var propertyName, property, targetHasProperty,
      propertyWouldNotBeOverriden, extensionIsPlainObject, className;

    for (propertyName in extension) {

      if (extension.hasOwnProperty(propertyName)) {

        targetHasProperty = target.hasOwnProperty(propertyName);

        if (shouldOverride || !targetHasProperty) {

          property = target[propertyName] = extension[propertyName];

          if (typeof property === 'function') {
            extensionIsPlainObject = (extension.toString === Object.prototype.toString);
            className = extensionIsPlainObject ? target.constructor : extension.constructor;

            applyMethodName(property, className + "::" + propertyName);
          }
        }
      }
    }
  };

  /**
   * Extend the given class prototype with properties and methods
   *
   * @param {function()} TargetClass Constructor of existing class
   * @param {Object} extension Properties and methods that are added to the prototype
   * @param {boolean} shouldOverride Specify if the extension should
   * override existing properties on the target class prototype
   *
   * @expose
   */
  Class['extend'] = function (TargetClass, extension, shouldOverride) {
    
    if (extension['STATIC']) {

      if(TargetClass.Super) {
        // add static properties of the super class to the class namespace
        Class['augment'](TargetClass, TargetClass.Super['_STATIC_'], true);
      }

      // add static properties and methods to the class namespace
      Class['augment'](TargetClass, extension['STATIC'], true);

      // save the static definitions into special var on the class namespace
      TargetClass['_STATIC_'] = extension['STATIC'];
      delete extension['STATIC'];
    }

    // add properties and methods to the class prototype
    Class['augment'](TargetClass.prototype, extension, shouldOverride);
  };

  /**
   * Sets up the classical inheritance chain between
   * the base class and the sub class. Adds a static
   * property to the sub class that references the 
   * base class.
   * 
   * @param  {Function} SubClass
   * @param  {Function} SuperClass
   * @return {undefined}
   */
  Class['inherit'] = function (SubClass, SuperClass) {

    if (SuperClass) {
      /** @constructor */
      var SuperClassProxy = function () {};
      SuperClassProxy.prototype = SuperClass.prototype;

      SubClass.prototype = new SuperClassProxy();
      SubClass.prototype.constructor = SubClass;

      /** @expose */
      SubClass.Super = SuperClass;

      Class['extend'](SubClass, SuperClass, false);
    }
  };

  /**
   * Copies the prototype properties of the given
   * implementations to the class prototype.
   * 
   * @param  {Function} TargetClass
   * @param  {Function|Array} implementations
   * @return {undefined}
   */
  Class['implement'] = function (TargetClass, implementations) {

    if (implementations) {
      var index;
      if (typeof implementations === 'function') {
        implementations = [implementations];
      }
      for (index = 0; index < implementations.length; index += 1) {
        Class['augment'](TargetClass.prototype, implementations[index].prototype, false);
      }
    }
  };

  /**
   * Creates a namespace chain and exposes the given object
   * at the last position of the given namespace.
   *
   * e.g: Class.namespace('lib.util.Math', {})
   * would create a namespace like window.lib.util.Math and 
   * assign the given object literal to last part: 'Math'
   * 
   * @param  {String} namespacePath
   * @param  {Object} exposedObject
   * @return {undefined}
   */
  Class['namespace'] = function (namespacePath, exposedObject) {

    if(typeof globalNamespace['define'] === "undefined") {
      var classPathArray, className, currentNamespace, currentPathItem, index;
    
      classPathArray = namespacePath.split('.');
      className = classPathArray[classPathArray.length - 1];
    
      currentNamespace = globalNamespace;
    
      for(index = 0; index < classPathArray.length - 1; index += 1) {
        currentPathItem = classPathArray[index];
        
        if(typeof currentNamespace[currentPathItem] === "undefined") {
          currentNamespace[currentPathItem] = {};
        }
        
        currentNamespace = currentNamespace[currentPathItem];
      }
      
      currentNamespace[className] = exposedObject;
    }
  };

  // Return as AMD module or attach to head object
  if (typeof define !== "undefined") {
    define('Class', [], function () { return Class; });
  }
  // expose on global namespace like window (browser) or exports (node)
  else if (globalNamespace) {
    /** @expose */
    globalNamespace['Class'] = Class;
  }

}(typeof define !== "undefined" || typeof window === "undefined" ? exports : window));
(function (globalNamespace) {
  "use strict";

  function defineInterfaceModule(Class) {
    /**
     * @constructor
     */
    var ImplementationMissingError = function (message) {
      this.name = "ImplementationMissingError";
      this.message = (message || "");
    };
    
    ImplementationMissingError.prototype = Error.prototype;

    function createExceptionThrower(interfaceName, methodName, expectedType) {
      return function() {
        var message = 'Missing implementation for <' + this + '::' + methodName + '> defined by interface ' + interfaceName;

        throw new ImplementationMissingError(message);
      };
    }

    var Interface = function(path, definition, local) {

      if(typeof path !== 'string') {
        throw new Error('Please give your interface a name. Pass "true" as last parameter to avoid global namespace pollution');
      }

      var NewInterface = function() {},
          pathArray = path.split('.'),
          interfaceName = pathArray[pathArray.length - 1],
          methodName,
          property;

      for(methodName in definition) {

        if(definition.hasOwnProperty(methodName)) {
          
          property = definition[methodName];

          NewInterface.prototype[methodName] = createExceptionThrower(interfaceName, methodName, property);
        }
      }

      if(!local) {
        Class['namespace'](path, NewInterface);
      }
      
      NewInterface.toString = function () { return interfaceName; };

      return NewInterface;
    };

    Interface['ImplementationMissingError'] = ImplementationMissingError;

    return Interface;
  }

  // Return as AMD module or attach to head object
  if (typeof define !== "undefined") {
    define('Interface', ['Class'], function (Class) { return defineInterfaceModule(Class); });
  } 
  // expose on agnostic namespace (browser)
  else if (typeof window !== "undefined") {
    /** @expose */
    globalNamespace['Interface'] = defineInterfaceModule(globalNamespace['Class']);
  }
  // expose on agnostic namespace (node)
  else {
    var Class = require('./Class')['Class'];
    globalNamespace.Interface = defineInterfaceModule(Class);
  }

}(typeof define !== "undefined" || typeof window === "undefined" ? exports : window));
(function (globalNamespace) {
  "use strict";

  var agnostic = {};

  // Return as AMD module or attach to head object
  if (typeof define !== "undefined") {
    define('agnostic', [], function () { return agnostic; });
  } 
  // expose on global namespace like window (browser) or exports (node)
  else if (globalNamespace) {
    /** @expose */
    globalNamespace['agnostic'] = agnostic;
  }
  
}(typeof define !== "undefined" || typeof window === "undefined" ? exports : window));
(function (globalNamespace) {
  "use strict";

  function defineSingletonProviderModule(Class) {

    return Class('agnostic.injection.SingletonProvider', {

      _type: null,
      _instance : null,

      initialize: function(type) {
        this._type = type;
      },

      provideInstance: function() {
        return this._instance || this._createSingleton();
      },

      getType: function() {
        return this._type;
      },

      _createSingleton: function() {
        return this._instance = new this._type();
      }

    });

  }

  // module dependencies
  var Class;

  // Return as AMD module or attach to head object
  if (typeof define !== "undefined") {
    define('agnostic/injection/SingletonProvider', ['Class'], function (Class) { 
      return defineSingletonProviderModule(Class);
    });
  } 
  // expose on agnostic namespace (browser)
  else if (typeof window !== "undefined") {
    /** @expose */
    Class = globalNamespace['Class'];
    defineSingletonProviderModule(Class);
  }
  // expose as node module
  else {
    Class = require('../../../src/Class')['Class'];
    globalNamespace.SingletonProvider = defineSingletonProviderModule(Class);
  }
  
}(typeof define !== "undefined" || typeof window === "undefined" ? exports : window));
(function (globalNamespace) {
  "use strict";

  function defineInjectionMappingModule(Class, SingletonProvider) {

    return Class('agnostic.injection.InjectionMapping', {

      _requestType: null,
      _responseType: null,
      _dependencyProvider: null,

      initialize: function(requestType) {
        this._requestType = requestType;
      },

      toSingleton: function(responseType) {
        this._responseType = responseType;
        this._dependencyProvider = new SingletonProvider(responseType);

        return this;
      },

      asSingleton: function() {
        return this.toSingleton(this._requestType);
      },

      getProvider: function() {
        return this._dependencyProvider;
      },

      getResponseType: function() {
        return this._responseType;
      },

      getRequestType: function() {
        return this._requestType;
      },

      getInstance: function() {
        return this._dependencyProvider.provideInstance();
      }

    });

  }

  // module dependencies
  var Class, SingletonProvider;

  // Return as AMD module or attach to head object
  if (typeof define !== "undefined") {
    define('agnostic/injection/InjectionMapping', ['Class', 'SingletonProvider'], function (Class, SingletonProvider) { 
      return defineInjectionMappingModule(Class, SingletonProvider);
    });
  } 
  // expose on agnostic namespace (browser)
  else if (typeof window !== "undefined") {
    /** @expose */
    Class = globalNamespace['Class'];
    SingletonProvider = globalNamespace.agnostic.injection.SingletonProvider;

    defineInjectionMappingModule(Class, SingletonProvider);
  }
  // expose as node module
  else {
    Class = require('../../../src/Class')['Class'];
    SingletonProvider = require('./SingletonProvider').SingletonProvider;

    globalNamespace.InjectionMapping = defineInjectionMappingModule(Class, SingletonProvider);
  }
  
}(typeof define !== "undefined" || typeof window === "undefined" ? exports : window));
(function (globalNamespace) {
  "use strict";

  function defineInjectorModule(Class, InjectionMapping) {

    return Class('agnostic.injection.Injector', {

      _typeMappings: [],

      map: function(type) {

        var mapping = new InjectionMapping(type);

        this._typeMappings.push(mapping);

        return mapping;
      },
      
      injectInto: function(injectee) {
        this._injectInto(injectee, null);
      },

      getInstanceFor: function(neededType) {
        return this._getInstanceFor(neededType, null);
      },

      _getInstanceFor: function(neededType, requestingType, skipInjection) {
        var mapping, isCircularDependency, instance = null;

        for(var index = 0; index < this._typeMappings.length; index++) {
          mapping = this._typeMappings[index];

          if(mapping.getRequestType() === neededType) {

            instance = mapping.getInstance();
            isCircularDependency = this._typeIsDependentOn(neededType, requestingType) ? true : false;

            if(!skipInjection) {
              this._injectInto(instance, neededType, requestingType, isCircularDependency);
            }
            
            return instance;
          }
        }
      },

      _injectInto: function(injectee, injecteeType, requestingType, isCircularDependency) {

        if(injectee && injectee.Dependencies) {
          var propertyName, neededType, instance, dependencies = injectee.Dependencies;

          for(propertyName in dependencies) {

            if(dependencies.hasOwnProperty(propertyName)) {
              neededType = dependencies[propertyName];

              if(isCircularDependency && neededType === requestingType) {
                
                // this is a circular dependency situation -> get the instance without injecting
                // into the first instance again to avoid endless loops.
                
                instance = this._getInstanceFor(neededType, injecteeType, true);
              } 
              else {
                instance = this._getInstanceFor(neededType, injecteeType);
              }

              if(instance != null) {
                injectee[propertyName] = instance;
              } 
              else {
                throw new Error('Type ' + neededType + ' is required by ' + injectee + ' but was not mapped on the injector.');
              }
            }
          }

        }
      },

      _typeIsDependentOn: function(dependentType, searchedDependency) {
        var propertyName, dependencies = dependentType.prototype.Dependencies;

        if(typeof dependencies !== 'object' || searchedDependency === null) {
          return false;
        }

        for(propertyName in dependencies) {
          
          if(dependencies.hasOwnProperty(propertyName)) {

            if(dependencies[propertyName] === searchedDependency) {
              return true;
            }
          }
        }

        // searchedDependency was not found on dependentType
        return false;
      }

    });

  }

  var Class, InjectionMapping;

  // Return as AMD module or attach to head object
  if (typeof define !== "undefined") {
    define('agnostic/injection/Injector', ['Class', 'InjectionMapping'], function (Class, InjectionMapping) { 
      return defineInjectorModule(Class, InjectionMapping);
    });
  } 
  // expose on agnostic namespace (browser)
  else if (typeof window !== "undefined") {
    /** @expose */
    Class = globalNamespace['Class'],
    InjectionMapping = globalNamespace.agnostic.injection.InjectionMapping;

    globalNamespace.agnostic.injection.Injector = defineInjectorModule(Class, InjectionMapping);
  }
  // expose on agnostic namespace (node)
  else {
    Class = require('../../../src/Class')['Class'];
    InjectionMapping = require('../../../src/agnostic/injection/InjectionMapping').InjectionMapping;

    globalNamespace.Injector = defineInjectorModule(Class, InjectionMapping);
  }
  
}(typeof define !== "undefined" || typeof window === "undefined" ? exports : window));
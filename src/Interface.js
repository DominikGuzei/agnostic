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

    var Interface = function(path, definition) {

      if(arguments.length < 2 && typeof path === 'object') {
        definition = path;
        path = 'Anonymous';
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

      Class['namespace'](path, NewInterface);
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
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

        if(injectee && injectee.Dependencies) {
          var propertyName, neededType, instance, dependencies = injectee.Dependencies;

          for(propertyName in dependencies) {

            if(dependencies.hasOwnProperty(propertyName)) {
              neededType = dependencies[propertyName];
              instance = this.getInstanceFor(neededType);

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

      getInstanceFor: function(neededType) {
        var mapping, instance = null;

        for(var index = 0; index < this._typeMappings.length; index++) {
          mapping = this._typeMappings[index];

          if(mapping.getRequestType() === neededType) {

            instance = mapping.getInstance();
            this.injectInto(instance);

            return instance;
          }
        }
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
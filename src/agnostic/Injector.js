(function (globalNamespace) {
  "use strict";

  function defineInjectorModule(Class) {

    return Class({

      _typeMappings: [],

      map: function(type) {

        var mapping = {
          type: type,
          responseType: null,
          responseInstance: null,

          toSingleton: function(type) {
            this.responseType = type;
          },

          provide: function() {
            return this.responseInstance || this._createResponseInstance();
          },

          _createResponseInstance: function() {
            return this.responseInstance = new this.responseType();
          }
        };

        this._typeMappings.push(mapping);

        return mapping;
      },
      
      injectInto: function(injectee) {

        if(injectee && injectee.Dependencies) {
          var propertyName, neededType, dependencies = injectee.Dependencies;

          for(propertyName in dependencies) {

            if(dependencies.hasOwnProperty(propertyName)) {
              neededType = dependencies[propertyName];

              injectee[propertyName] = this.getInstanceFor(neededType);
            }
          }

        }
      },

      getInstanceFor: function(neededType) {
        var mapping;

        for(var index = 0; index < this._typeMappings.length; index++) {
          mapping = this._typeMappings[index];

          if(mapping.type === neededType) {
            return mapping.provide();
          }
        }
      }

    });

  }

  // Return as AMD module or attach to head object
  if (typeof define !== "undefined") {
    define('agnostic.Injector', ['Class'], function (Class) { 
      return defineInjectorModule(Class);
    });
  } 
  // expose on agnostic namespace (browser)
  else if (typeof window !== "undefined") {
    /** @expose */
    globalNamespace['agnostic']['Injector'] = defineInjectorModule(globalNamespace['Class']);
  }
  // expose on agnostic namespace (node)
  else {
    var Class = require('../Class').Class;
    globalNamespace.Injector = defineInjectorModule(Class);
  }
  
}(typeof define !== "undefined" || typeof window === "undefined" ? exports : window));
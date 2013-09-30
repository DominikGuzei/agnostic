(function (globalNamespace) {
  "use strict";

  function defineInjectionMappingModule(Class, SingletonProvider) {

    return Class({

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
    SingletonProvider = globalNamespace['SingletonProvider'];

    globalNamespace['agnostic']['InjectionMapping'] = defineInjectionMappingModule(Class, SingletonProvider);
  }
  // expose as node module
  else {
    Class = require('../../../src/Class')['Class'];
    SingletonProvider = require('./SingletonProvider').SingletonProvider;

    globalNamespace.InjectionMapping = defineInjectionMappingModule(Class, SingletonProvider);
  }
  
}(typeof define !== "undefined" || typeof window === "undefined" ? exports : window));
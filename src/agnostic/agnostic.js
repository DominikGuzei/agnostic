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
/*
 * agnostic
 * Minimal JavaScript architecture to build framework-agnostic
 * and delivery mechanism independent applications
 *
 * https://github.com/DominikGuzei/agnostic
 *
 * Copyright (c) 2013 Dominik Guzei
 * Licensed under the MIT license.
 */
(function (global) {
  "use strict";

  var agnostic = {};

  // Return as AMD module or attach to head object
  if (typeof define !== "undefined") {
    define([], function () { return agnostic; });
  } else if (global) {
    /** @expose on window in browser */
    global['agnostic'] = agnostic;
  } else {
    /** @expose in node.js */
    module.exports = agnostic;
  }
  
}(typeof define !== "undefined" || typeof window === "undefined" ? null : window));
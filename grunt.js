module.exports = function(grunt) {
  "use strict";

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',

    lint: {
      files: ['grunt.js', 'src/**/*.ts']
    },

    watch: {
      files: ['grunt.js', 'src/**/*.ts', 'spec/**/*.js'],
      tasks: 'test'
    },

    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        node: true
      },

      globals: {
        exports: true,
        window: true,
        define: true,
        describe: true,
        expect: true,
        it: true
      }
    },

    concat: {
      files: {
        src: ['src/agnostic.js'],
        dest: 'built/agnostic.js'
      }
    },

    min: {
      dist: {
        src: 'src/agnostic.js',
        dest: 'built/agnostic.min.js'
      }
    },

    mochaTest: {
      development: ['spec/spec-setup-development.js', 'spec/**/*.spec.js'],
      production: ['spec/spec-setup-production.js', 'spec/**/*.spec.js']
    },

    mochaTestConfig: {
      options: {
        reporter: 'spec',
        globals: 'define'
      }
    }
  });

  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.registerTask('test', 'lint concat mochaTest:development');
  grunt.registerTask('build', 'lint min mochaTest:production');
  grunt.registerTask('default', 'watch');

};
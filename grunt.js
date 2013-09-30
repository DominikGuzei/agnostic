module.exports = function(grunt) {
  "use strict";

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',

    lint: {
      files: ['grunt.js', 'src/**/*.js']
    },

    watch: {
      files: ['grunt.js', 'src/**/*.js', 'spec/**/*.js'],
      tasks: 'test'
    },

    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: false,
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

        src: ['src/Class.js', 
              'src/Interface.js',
              'src/agnostic.js',
              'src/agnostic/Injector.js'],

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
      development: ['spec/spec-setup-development.js', 'spec/**/*.spec.js']
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
  grunt.registerTask('build', 'lint min');
  grunt.registerTask('default', 'watch');

};
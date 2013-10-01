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

        src: [
              'src/Class.js', 
              'src/Interface.js',
              'src/agnostic/agnostic.js',
              'src/agnostic/injection/SingletonProvider.js',
              'src/agnostic/injection/InjectionMapping.js',
              'src/agnostic/injection/Injector.js'
             ],

        dest: 'built/agnostic.js'
      }
    },

    min: {
      dist: {
        src: 'built/agnostic.js',
        dest: 'built/agnostic.min.js'
      }
    },

    mochaTest: {
      development: ['spec/node/spec-node-setup.js', 'spec/agnostic/**/*.spec.js']
    },

    mochaTestConfig: {
      options: {
        reporter: 'min',
        globals: 'define'
      }
    }
  });

  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-closure-compiler');

  grunt.registerTask('test', 'lint concat mochaTest:development');
  grunt.registerTask('build', 'lint min');
  grunt.registerTask('default', 'watch');

};
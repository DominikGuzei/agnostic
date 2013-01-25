module.exports = function(grunt) {
  "use strict";

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',

    lint: {
      files: ['grunt.js']
    },

    watch: {
      files: ['grunt.js', 'src/**/*.js', 'spec/**/*.js'],
      tasks: 'build'
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

    min: {
      dist: {
        src: 'src/agnostic.js',
        dest: 'built/agnostic.min.js'
      }
    },

    mochaTest: {
      files: ['spec/spec-setup.js', 'spec/**/*.spec.js']
    },

    mochaTestConfig: {
      options: {
        reporter: 'spec',
        globals: 'define'
      }
    }
  });

  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.registerTask('test', 'mochaTest');
  grunt.registerTask('build', 'lint min mochaTest');
  grunt.registerTask('default', 'watch');

};
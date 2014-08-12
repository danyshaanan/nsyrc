'use strict';

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // githooks: {
    //   all: {
    //     'pre-commit': 'jshint'
    //   }
    // },
    jshint: {
      options: {
        node: true,
        unused: 'vars',
        globalstrict: true,
        validthis: true,
        // eqeqeq: true,
        forin: true,
        latedef: true,
        quotmark: 'single',
        undef: true,
        trailing: true,
        lastsemic: true,
        asi: true
      },
      src: {
        src: ['src/**/*.*']
      },
      test: {
        src: ['test/**/*.*'],
        options: {
          jasmine: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  // grunt.loadNpmTasks('grunt-githooks');

  grunt.registerTask('default', [/*'githooks',*/'jshint']);
};

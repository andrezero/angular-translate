module.exports = function(grunt) {
    'use strict';

    grunt.registerTask('build', [
        'test',
        'clean',
        'jshint',
        'ngtemplates',
        'concat',
        'ngmin',
        'uglify'
    ]);

};

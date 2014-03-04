/* jshint globalstrict: false */
module.exports = function(grunt) {
	'use strict';

	require('load-grunt-tasks')(grunt);

	grunt.initConfig({

		pkg: grunt.file.readJSON('bower.json'),

		language: grunt.option('lang') || 'en',

		meta: {
			banner: '/**\n * <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
				'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
				' * <%= pkg.homepage %>\n' +
				' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
				' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>\n */\n'
		},

		build_dir: 'dist',
		tmp_dir: 'tmp',

		lib_files: {

			core: [
				'src/index.js',
                'src/config.js',
				'src/translate.js',
				'src/service/translate.js',
				'src/service/default-interpolation.js',
				'src/service/storage-key.js',
				'src/filter/translate.js',
				'src/directive/translate.js',
				'src/directive/translate-cloak.js',
				'src/filter/translate.js'
			],

			ctx: [
				'src/index.js',
                'src/config.js',
				'src/service/storage-key.js',
				'src/service/default-interpolation.js',
				'src/service/translate.js',
				'src/service/loader-static-files.js',
				'src/filter/translate.js',
				'src/directive/translate.js',
				'src/directive/locale-selector.js',
				'src/directive/translate-cloak.js',
				'src/translate.js'
			],

			ext: {
				default_interpolation: ['src/service/default-interpolation.js'],
				messageformat_interpolation: ['src/service/messageformat-interpolation.js'],
				handler_log: ['src/service/handler-log.js'],
				loader_partial: ['src/service/loader-partial.js'],
				loader_static_files: ['src/service/loader-static-files.js'],
				loader_url: ['src/service/loader-url.js'],
				storage_cookie: ['src/service/storage-cookie.js'],
				storage_local: ['src/service/storage-local.js'],
				all: [
					'src/service/default-interpolation.js',
					'src/service/messageformat-interpolation.js',
					'src/service/handler-log.js',
					'src/service/loader-partial.js',
					'src/service/loader-static-files.js',
					'src/service/loader-url.js',
					'src/service/storage-cookie.js',
					'src/service/storage-local.js'
				]
			},

            templates: ['templates/*.tpl.html'],

			test: ['test/**/*.js']
		},
		// Compiles the HTML templates into a Javascript file
		ngtemplates: {
			ngTagsInput: {
				files: {
					'<%= tmp_dir %>/tpl.js': ['templates/*.tpl.html']
				},
				options: {
					url: function(url) {
						return 'templates/' + url.replace('templates/', '');
					},
					bootstrap: function(module, script) {
						return '/* HTML templates */\n' +
							'ngTranslate.run(function($templateCache) {\n' + script + '});\n';
					},
					htmlmin: {
						collapseWhitespace: true,
						removeRedundantAttributes: true
					}
				}
			}
		},

		clean: {
			build: ['<%= build_dir %>']
		},

		watch: {

			scripts: {
				files: ['Gruntfile.js', '<%= lib_files.core %>', '<%= lib_files.ext.all %>', '<%= lib_files.test %>', '<%= lib_files.templates %>'],
				tasks: ['jshint:all', 'karma:unit']
			},

			livereload: {
				options: {
					livereload: true
				},
				// TODO actually complete demo except copied "angular-translate-latest.js"
				files: ['src/**/*.js', '<%= lib_files.templates %>'],
				tasks: ['jshint', 'ngtemplates', 'karma:unit', 'concat']
			}
		},

		jshint: {

			options: {
				eqeqeq: true,
				globals: {
					angular: true
				}
			},

			all: ['Gruntfile.js', '<%= lib_files.core %>', '<%= lib_files.ext.all %>', '<%= lib_files.test %>'],

			ctx: ['Gruntfile.js', '<%= lib_files.ctx%>' ],
			core: {
				files: {
					src: ['<%= lib_files.core %>']
				}
			},

			extensions: {
				files: {
					src: ['<%= lib_files.ext.all %>']
				}
			},

			default_interpolation: {
				files: {
					src: ['<%= lib_files.ext.default_interpolation %>']
				}
			},

			messageformat_interpolation: {
				files: {
					src: ['<%= lib_files.ext.messageformat_interpolation %>']
				}
			},

			handler_log: {
				files: {
					src: ['<%= lib_files.ext.handler_log %>']
				}
			},

			loader_partial: {
				files: {
					src: ['<%= lib_files.ext.loader_partial %>']
				}
			},

			loader_static_files: {
				files: {
					src: ['<%= lib_files.ext.loader_static_files %>']
				}
			},

			loader_url: {
				files: {
					src: ['<%= lib_files.ext.loader_url %>']
				}
			},

			storage_cookie: {
				files: {
					src: ['<%= lib_files.ext.storage_cookie %>']
				}
			},

			storage_local: {
				files: {
					src: ['<%= lib_files.ext.storage_local %>']
				}
			},

			test: {
				files: {
					src: ['<%= lib_files.test %>']
				}
			}
		},

		concat: {

			banner: {
				options: {
					banner: '<%= meta.banner %>'
				},
				src: '<%= concat.core.dest %>',
				dest: '<%= concat.core.dest %>'
			},

			ctx: {
				options: {
					banner: '(function() {\n\'use strict\';\n\n',
					footer: '\n}());',
					separator: '\n\n',
					process: function(src) {
						// Remove all 'use strict'; from the code and
						// replaces all double blank lines with one
						return src.replace(/'use strict';\n+/g, '')
							.replace(/\n\n\s*\n/g, '\n\n');
					}
				},
				src: ['<%= lib_files.ctx %>', '<%= tmp_dir %>/tpl.js'],
				dest: '<%= build_dir %>/ctx-angular-translate.js'
			},
			core: {
				src: ['<%= lib_files.core %>'],
				dest: '<%= build_dir %>/angular-translate.js'
			},

			default_interpolation: {
				src: ['<%= lib_files.ext.default_interpolation %>'],
				dest: '<%= build_dir%>/angular-translate-interpolation-default/angular-translate-interpolation-default.js'
			},

			messageformat_interpolation: {
				src: ['<%= lib_files.ext.messageformat_interpolation %>'],
				dest: '<%= build_dir%>/angular-translate-interpolation-messageformat/angular-translate-interpolation-messageformat.js'
			},

			handler_log: {
				src: ['<%= lib_files.ext.handler_log %>'],
				dest: '<%= build_dir %>/angular-translate-handler-log/angular-translate-handler-log.js'
			},

			loader_partial: {
				src: ['<%= lib_files.ext.loader_partial %>'],
				dest: '<%= build_dir %>/angular-translate-loader-partial/angular-translate-loader-partial.js'
			},

			loader_static_files: {
				src: ['<%= lib_files.ext.loader_static_files %>'],
				dest: '<%= build_dir %>/angular-translate-loader-static-files/angular-translate-loader-static-files.js'
			},

			loader_url: {
				src: ['<%= lib_files.ext.loader_url%>'],
				dest: '<%= build_dir %>/angular-translate-loader-url/angular-translate-loader-url.js'
			},

			storage_cookie: {
				src: ['<%= lib_files.ext.storage_cookie %>'],
				dest: '<%= build_dir %>/angular-translate-storage-cookie/angular-translate-storage-cookie.js'
			},

			storage_local: {
				src: ['<%= lib_files.ext.storage_local%>'],
				dest: '<%= build_dir %>/angular-translate-storage-local/angular-translate-storage-local.js'
			}

		},

		uglify: {
			core: {
				files: {
					'<%= build_dir %>/angular-translate.min.js': '<%= concat.core.dest %>'
				}
			},

			ctx: {
				files: {
					'<%= build_dir %>/ctx-angular-translate.min.js': '<%= concat.ctx.dest %>'
				}
			},

			default_interpolation: {
				files: {
					'<%= build_dir %>/angular-translate-interpolation-default/angular-translate-interpolation-default.min.js': '<%= concat.default_interpolation.dest %>'
				}
			},

			messageformat_interpolation: {
				files: {
					'<%= build_dir %>/angular-translate-interpolation-messageformat/angular-translate-interpolation-messageformat.min.js': '<%= concat.messageformat_interpolation.dest %>'
				}
			},

			handler_log: {
				files: {
					'<%= build_dir %>/angular-translate-handler-log/angular-translate-handler-log.min.js': '<%= concat.handler_log.dest %>'
				}
			},

			loader_partial: {
				files: {
					'<%= build_dir %>/angular-translate-loader-partial/angular-translate-loader-partial.min.js': '<%= concat.loader_partial.dest %>'
				}
			},

			loader_static_files: {
				files: {
					'<%= build_dir %>/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js': '<%= concat.loader_static_files.dest %>'
				}
			},

			loader_url: {
				files: {
					'<%= build_dir %>/angular-translate-loader-url/angular-translate-loader-url.min.js': '<%= concat.loader_url.dest %>'
				}
			},

			storage_cookie: {
				files: {
					'<%= build_dir %>/angular-translate-storage-cookie/angular-translate-storage-cookie.min.js': '<%= concat.storage_cookie.dest %>'
				}
			},

			storage_local: {
				files: {
					'<%= build_dir %>/angular-translate-storage-local/angular-translate-storage-local.min.js': '<%= concat.storage_local.dest %>'
				}
			}
		},

		copy: {

			demo: {
				files: [{
					src: 'angular-translate.js',
					dest: 'demo/js/',
					cwd: 'dist/',
					expand: true
				}]
			},

			logos: {
				files: [{
					src: ['logo/**'],
					dest: '<%= ngdocs.options.dest %>/img/',
					cwd: 'identity/',
					expand: true
				}]
			},
			docs_index: {
				files: [{
					src: ['index.html'],
					dest: '<%= ngdocs.options.dest %>/',
					cwd: 'docs/html/',
					expand: true
				}]
			},
			docs_assets: {
				files: [{
					src: ['img/**'],
					dest: '<%= ngdocs.options.dest %>/',
					cwd: 'docs/',
					expand: true
				}, {
					src: ['data/**'],
					dest: '<%= ngdocs.options.dest %>/',
					cwd: 'docs/',
					expand: true
				}]
			}
		},

		karma: {

			// Runs standard tests in default browser
			'unit': {
				configFile: 'karma.unit.conf.js',
				singleRun: true
			},
			'unitCtx': {
				configFile: 'karma.unit.ctx.conf.js',
				singleRun: true
			},
			'midway': {
				configFile: 'karma.midway.conf.js',
				singleRun: true
			},

			// Runs standard tests in headless PhantomJS
			'headless-unit': {
				configFile: 'karma.unit.conf.js',
				singleRun: true,
				browsers: ['PhantomJS']
			},
			'headless-midway': {
				configFile: 'karma.midway.conf.js',
				singleRun: true,
				browsers: ['PhantomJS']
			},

			// Runs standard tests in Firefox
			'browser-firefox-unit': {
				configFile: 'karma.unit.conf.js',
				singleRun: true,
				browsers: ['Firefox']
			},
			'browser-firefox-midway': {
				configFile: 'karma.midway.conf.js',
				singleRun: true,
				browsers: ['Firefox']
			},

			// Opens the default browser on the default port for advanced debugging.
			'debug-unit': {
				configFile: 'karma.unit.conf.js',
				singleRun: false
			},
			'debug-midway': {
				configFile: 'karma.midway.conf.js',
				singleRun: false
			}
		},

		changelog: {
			options: {
				dest: 'CHANGELOG.md'
			}
		},

		ngmin: {

			core: {
				src: '<%= concat.core.dest %>',
				dest: '<%= concat.core.dest %>'
			},

			ctx: {
				src: '<%= concat.ctx.dest %>',
				dest: '<%= concat.ctx.dest %>'
			},

			default_interpolation: {
				src: '<%= concat.default_interpolation.dest %>',
				dest: '<%= concat.default_interpolation.dest %>'
			},

			messageformat_interpolation: {
				src: '<%= concat.messageformat_interpolation.dest %>',
				dest: '<%= concat.messageformat_interpolation.dest %>'
			},

			handler_log: {
				src: '<%= concat.handler_log.dest %>',
				dest: '<%= concat.handler_log.dest %>'
			},

			loader_partial: {
				src: '<%= concat.loader_partial.dest %>',
				dest: '<%= concat.loader_partial.dest %>'
			},

			loader_static_files: {
				src: '<%= concat.loader_static_files.dest %>',
				dest: '<%= concat.loader_static_files.dest %>'
			},

			loader_url: {
				src: '<%= concat.loader_url.dest %>',
				dest: '<%= concat.loader_url.dest %>'
			},

			storage_cookie: {
				src: '<%= concat.storage_cookie.dest %>',
				dest: '<%= concat.storage_cookie.dest %>'
			},

			storage_local: {
				src: '<%= concat.storage_local.dest %>',
				dest: '<%= concat.storage_local.dest %>'
			}
		},

		express: {
			server: {
				options: {
					port: 3005,
					bases: '.',
					server: __dirname + '/server.js'
				}
			}
		},

		ngdocs: {
			options: {
				dest: 'tmp',
				navTemplate: 'docs/html/nav.html',
				html5Mode: false,
				title: false,
				image: 'identity/logo/angular-translate-alternative/angular-translate_alternative_small2.png',
				imageLink: 'http://pascalprecht.github.io/angular-translate',
				startPage: '/guide',
				scripts: [
					'http://getbootstrap.com/2.3.2/assets/js/bootstrap-dropdown.js',
					'http://rawgithub.com/SlexAxton/messageformat.js/master/messageformat.js',
					'http://rawgithub.com/SlexAxton/messageformat.js/master/locale/de.js',
					'http://code.angularjs.org/1.1.5/angular.min.js',
					'http://rawgithub.com/angular/bower-angular-cookies/master/angular-cookies.min.js',
					'http://rawgithub.com/angular-translate/bower-angular-translate/master/angular-translate.min.js',
					'http://rawgithub.com/angular-translate/bower-angular-translate-interpolation-messageformat/master/angular-translate-interpolation-messageformat.min.js',
					'http://rawgithub.com/angular-translate/bower-angular-translate-storage-cookie/master/angular-translate-storage-cookie.min.js',
					'http://rawgithub.com/angular-translate/bower-angular-translate-storage-local/master/angular-translate-storage-local.min.js',
					'http://rawgithub.com/angular-translate/bower-angular-translate-loader-static-files/master/angular-translate-loader-static-files.min.js',
					'http://rawgithub.com/angular-translate/bower-angular-translate-handler-log/master/angular-translate-handler-log.min.js'
				],
				styles: ['docs/css/styles.css']
			},
			api: {
				src: [
					'src/translate.js',
					'src/**/*.js',
					'docs/content/api/*.ngdoc'
				],
				title: 'API Reference'
			},
			guide: {
				src: ['docs/content/guide/<%= language %>/*.ngdoc'],
				title: 'Guide'
			}
		}
	});


	grunt.registerTask('ctx', ['clean', 'jshint:ctx', 'ngtemplates', 'concat:ctx', 'ngmin:ctx', 'uglify:ctx']);


	grunt.registerTask('default', ['jshint:all', 'karma']);
	grunt.registerTask('test', ['karma:unit', 'karma:midway']);

	// Advanced test tasks
	grunt.registerTask('test-headless', ['karma:headless-unit', 'karma:headless-midway']);
	grunt.registerTask('test-browser-firefox', ['karma:browser-firefox-unit', 'karma:browser-firefox-midway']);
	grunt.registerTask('test-all', ['karma']);

	grunt.registerTask('build', [
		'jshint:all',
		'karma',
		'build:core',
		'build:messageformat_interpolation',
		'build:handler_log',
		'build:loader_partial',
		'build:loader_static_files',
		'build:loader_url',
		'build:storage_cookie',
		'build:storage_local'
	]);

	grunt.registerTask('build:core', [
		'jshint:core',
		'concat:core',
		'ngmin:core',
		'concat:banner',
		'uglify:core'
	]);

	grunt.registerTask('build:default_interpolation', [
		'jshint:default_interpolation',
		'concat:default_interpolation',
		'ngmin:default_interpolation',
		'uglify:default_interpolation'
	]);

	grunt.registerTask('build:messageformat_interpolation', [
		'jshint:messageformat_interpolation',
		'concat:messageformat_interpolation',
		'ngmin:messageformat_interpolation',
		'uglify:messageformat_interpolation'
	]);

	grunt.registerTask('build:handler_log', [
		'jshint:handler_log',
		'concat:handler_log',
		'ngmin:handler_log',
		'uglify:handler_log'
	]);

	grunt.registerTask('build:loader_partial', [
		'jshint:loader_partial',
		'concat:loader_partial',
		'ngmin:loader_partial',
		'uglify:loader_partial'
	]);

	grunt.registerTask('build:loader_static_files', [
		'jshint:loader_static_files',
		'concat:loader_static_files',
		'ngmin:loader_static_files',
		'uglify:loader_static_files'
	]);

	grunt.registerTask('build:loader_url', [
		'jshint:loader_url',
		'concat:loader_url',
		'ngmin:loader_url',
		'uglify:loader_url'
	]);

	grunt.registerTask('build:storage_cookie', [
		'jshint:storage_cookie',
		'concat:storage_cookie',
		'ngmin:storage_cookie',
		'uglify:storage_cookie'
	]);

	grunt.registerTask('build:storage_local', [
		'jshint:storage_local',
		'concat:storage_local',
		'ngmin:storage_local',
		'uglify:storage_local'
	]);


	// For development purpose.
	grunt.registerTask('dev', ['jshint', 'ngtemplates', 'karma:unit', 'concat', 'watch:livereload']);
	grunt.registerTask('server', ['express', 'express-keepalive']);
};

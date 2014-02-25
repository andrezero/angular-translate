describe('pascalprecht.translate', function() {

	describe('$translateDirective (single-lang)', function() {

		var element;

		beforeEach(module('pascalprecht.translate', function($translateProvider) {
			$translateProvider
				.translations('en', {
					'EXISTING_TRANSLATION_ID': 'foo',
					'ANOTHER_ONE': 'bar',
					'TRANSLATION_ID': 'foo',
					'TD_WITH_VALUE': 'Lorem Ipsum {{value}}',
					'TRANSLATION_ID_2': 'Lorem Ipsum {{value}} + {{value}}',
					'TRANSLATION_ID_3': 'Lorem Ipsum {{value + value}}',
					'YET_ANOTHER': 'Hallo da!',
					'TEXT_WITH_VALUE': 'This is a text with given value: {{value}}',
					'HOW_ABOUT_THIS': '{{value}} + {{value}}',
					'AND_THIS': '{{value + value}}',
					'BLANK_VALUE': ''
				})
				.preferredLanguage('en');
		}));

		var $compile, $rootScope;

		beforeEach(inject(function(_$compile_, _$rootScope_) {
			$compile = _$compile_;
			$rootScope = _$rootScope_;
		}));

		it('should leave the content of the tag as it is if translation doesn\'t exist', function() {
			element = $compile('<div translate="TEXT">fallback text</div>')($rootScope);
			$rootScope.$digest();
			expect(element.text()).toBe('fallback text');
		});

		it('should return translation if translation id exist', function() {
			element = $compile('<div translate="TRANSLATION_ID"></div>')($rootScope);
			$rootScope.$digest();
			expect(element.text()).toBe('foo');

			element = $compile('<div translate="BLANK_VALUE"></div>')($rootScope);
			$rootScope.$digest();
			expect(element.text()).toBe('');
		});

		it('should return translation id if translation doesn\'t exist and if its passed as interpolation', function() {
			$rootScope.translationId = 'TEXT';
			element = $compile('<div translate="{{translationId}}">fallback text</div>')($rootScope);
			$rootScope.$digest();
			expect(element.text()).toBe('fallback text');
		});

		it('should return translation if translation id exist and is passed as interpolation', function() {
			$rootScope.translationId = 'TRANSLATION_ID';
			element = $compile('<div translate="{{translationId}}"></div>')($rootScope);
			$rootScope.$digest();
			expect(element.text()).toBe('foo');
		});


		describe('Passing values', function() {
			var element;
			describe('whereas no values given', function() {

				it('should replace interpolation directive with empty string', function() {
					element = $compile('<div translate="TRANSLATION_ID"></div>')($rootScope);
					$rootScope.$digest();
					expect(element.text()).toBe('foo');
				});

				it('should replace interpolation directive with empty string when translation is an interplation', function() {
					$rootScope.translationId = 'TD_WITH_VALUE';
					element = $compile('<div translate="{{translationId}}"></div>')($rootScope);
					$rootScope.$digest();
					expect(element.text()).toBe('Lorem Ipsum ');
				});

				it('should replace interpolation directive with empty string if translation id is in content', function() {
					element = $compile('<div translate>TD_WITH_VALUE</div>')($rootScope);
					$rootScope.$digest();
					expect(element.text()).toBe('Lorem Ipsum ');
				});

				it('should replace interpolation directive with empty string if td id is in content and interpolation', function() {
					$rootScope.translationId = 'TD_WITH_VALUE';
					element = $compile('<div translate>{{translationId}}</div>')($rootScope);
					$rootScope.$digest();
					expect(element.text()).toBe('Lorem Ipsum ');
				});
			});

			describe('while values given as string', function() {

				it('should replace interpolate directive when td id is attribute value', function() {
					element = $compile('<div translate="TD_WITH_VALUE" translate-values="{value: \'foo\'}"></div>')($rootScope);
					$rootScope.$digest();
					expect(element.text()).toBe('Lorem Ipsum foo');
				});

				it('should replace interpolate directive when td id is attribute value and interpolation', function() {
					$rootScope.translationId = 'TD_WITH_VALUE';
					element = $compile('<div translate="{{translationId}}" translate-values="{value: \'foo\'}"></div>')($rootScope);
					$rootScope.$digest();
					expect(element.text()).toBe('Lorem Ipsum foo');
				});

				it('should replace interpolate directive when td id is attribute value and interpolation', function() {
					$rootScope.values = {
						foo: 'bar'
					};
					$rootScope.translationId = 'TD_WITH_VALUE';
					element = $compile('<div translate="{{translationId}}" translate-values="{value: values.foo}"></div>')($rootScope);
					$rootScope.$digest();
					expect(element.text()).toBe('Lorem Ipsum bar');
                    $rootScope.values.foo = 'catacroquer';
					$rootScope.$digest();
					expect(element.text()).toBe('Lorem Ipsum catacroquer');

				});

				it('should replace interpolate directive when td id is given as content', function() {
					element = $compile('<div translate translate-values="{value: \'foo\'}">TRANSLATION_ID</div>')($rootScope);
					$rootScope.$digest();
					expect(element.text()).toBe('foo');
				});

				it('should replace interpolate directive when td id is given as content and as interpolation', function() {
					$rootScope.translationId = 'TRANSLATION_ID';
					element = $compile('<div translate translate-values="{value: \'foo\'}">{{translationId}}</div>')($rootScope);
					$rootScope.$digest();
					expect(element.text()).toBe('foo');
				});
			});

			describe('while values given as interpolation directive', function() {

				it('should replace interpolate directive when td id is attribute value', function() {
					$rootScope.values = {
						value: 'foo'
					};
					element = $compile('<div translate="TD_WITH_VALUE" translate-values="{{values}}"></div>')($rootScope);
					$rootScope.$digest();
					expect(element.text()).toBe('Lorem Ipsum foo');
				});

				it('should replace interpolate directive when td id is attribute value and interpolation', function() {
					$rootScope.translationId = 'TD_WITH_VALUE';
					$rootScope.values = {
						value: 'foo'
					};
					element = $compile('<div translate="{{translationId}}" translate-values="{{values}}"></div>')($rootScope);
					$rootScope.$digest();
					expect(element.text()).toBe('Lorem Ipsum foo');
				});

				it('should replace interpolate directive when td id is given as content', function() {
					$rootScope.values = {
						value: 'foo'
					};
					element = $compile('<div translate translate-values="{{values}}">TRANSLATION_ID</div>')($rootScope);
					$rootScope.$digest();
					expect(element.text()).toBe('foo');
				});

				it('should replace interpolate directive when td id is given as content and as interpolation', function() {
					$rootScope.translationId = 'TRANSLATION_ID';
					$rootScope.values = {
						values: 'foo'
					};
					element = $compile('<div translate translate-values="{{values}}">{{translationId}}</div>')($rootScope);
					$rootScope.$digest();
					expect(element.text()).toBe('foo');
				});
			});

			describe('while given values refer to scope data', function() {

				it('should replace interpolate directive and keep updated when td id is attribute value and refers to scope data', function() {
					inject(function($rootScope, $compile, $timeout) {
						$rootScope.translationId = 'TD_WITH_VALUE';
						$rootScope.user = {
							name: 'foo'
						};
						element = $compile('<div translate="{{translationId}}" translate-values="{ value: user.name }"></div>')($rootScope);
						$rootScope.$digest();
						expect(element.text()).toBe('Lorem Ipsum foo');
						$rootScope.user.name = 'bar';
						$rootScope.$digest();
						expect(element.text()).toBe('Lorem Ipsum bar');
					});
				});
			});
		});
	});

	describe('translate-interpolation attribute', function() {

		var $rootScope, $compile;

		beforeEach(module('pascalprecht.translate', function($translateProvider, $provide) {

			$provide.factory('customInterpolation', function() {

				var translateInterpolator = {},
					$locale;

				// provide a method to set locale
				translateInterpolator.setLocale = function(locale) {
					$locale = locale;
				};

				// provide a method to return an interpolation identifier
				translateInterpolator.getInterpolationIdentifier = function() {
					return 'custom';
				};

				// defining the actual interpolate function
				translateInterpolator.interpolate = function(string, interpolateParams) {
					return 'custom interpolation';
				};

				return translateInterpolator;
			});

			$translateProvider.translations('en', {
				'FOO': 'Yesssss'
			});

			$translateProvider
				.addInterpolation('customInterpolation')
				.preferredLanguage('en');
		}));

		beforeEach(inject(function(_$rootScope_, _$compile_) {
			$rootScope = _$rootScope_;
			$compile = _$compile_;
		}));

		it('should consider translate-interpolation value', function() {
			// we can use normal interpolation
			var element = $compile('<p translate="FOO"></p>')($rootScope);
			$rootScope.$digest();
			expect(element.text()).toEqual('Yesssss');

			// and we can override it
			element = $compile('<p translate="FOO" translate-interpolation="custom"></p>')($rootScope);
			$rootScope.$digest();
			expect(element.text()).toEqual('custom interpolation');
		});
	});

	describe('custom translate-value-* attributes', function() {
		var element;

		beforeEach(module('pascalprecht.translate', function($translateProvider) {
			$translateProvider
				.translations('en', {
					'FOO': 'hello my name is {{name}}',
					'BAR': 'and I\'m {{age}} years old',
					'BAZINGA': 'hello my name is {{name}} and I\'m {{age}} years old.',
					'YAY': 'hello my name is {{name}} and I\'m {{age}} years old. {{foo}}'
				})
				.preferredLanguage('en');
		}));

		beforeEach(inject(function(_$rootScope_, _$compile_) {
			$rootScope = _$rootScope_;
			$compile = _$compile_;

			$rootScope.name = 'Pascal';
			$rootScope.age = 22;
		}));

		it('should use custom translate-value-* attributes for variable replacement', function() {
			element = $compile('<p translate="FOO" translate-value-name="Pascal"></p>')($rootScope);
			$rootScope.$digest();
			expect(element.text()).toEqual('hello my name is Pascal');
			element = $compile('<p translate="BAR" translate-value-age="22"></p>')($rootScope);
			$rootScope.$digest();
			expect(element.text()).toEqual('and I\'m 22 years old');
			element = $compile('<p translate="BAZINGA" translate-value-name="Pascal" translate-value-age="22"></p>')($rootScope);
			$rootScope.$digest();
			expect(element.text()).toEqual('hello my name is Pascal and I\'m 22 years old.');
			element = $compile('<p translate="YAY" translate-value-name="Pascal" translate-value-age="22" translate-values=\'{ foo: "bar" }\'></p>')($rootScope);
			$rootScope.$digest();
			expect(element.text()).toEqual('hello my name is Pascal and I\'m 22 years old. bar');
		});

		it('should use custom translate-value-* attributes with interpolation', function() {
			element = $compile('<p translate="FOO" translate-value-name="{{name}}"></p>')($rootScope);
			$rootScope.$digest();
			expect(element.text()).toEqual('hello my name is Pascal');
			element = $compile('<p translate="BAR" translate-value-age="{{age}}"></p>')($rootScope);
			$rootScope.$digest();
			expect(element.text()).toEqual('and I\'m 22 years old');
			element = $compile('<p translate="BAZINGA" translate-value-name="{{name}}" translate-value-age="{{age}}"></p>')($rootScope);
			$rootScope.$digest();
			expect(element.text()).toEqual('hello my name is Pascal and I\'m 22 years old.');
		});
	});

	describe('translate sanitization', function() {

		var $rootScope, $compile;

		beforeEach(module('pascalprecht.translate', function($translateProvider, $provide) {

			$translateProvider.translations('en', {
				'hacking': '{{v}}'
			});

			$translateProvider.preferredLanguage('en');
		}));

		beforeEach(inject(function(_$rootScope_, _$compile_) {
			$rootScope = _$rootScope_;
			$compile = _$compile_;
		}));

		it('should be disabled at default', function() {
			element = $compile('<p translate="hacking" translate-values="{v: \'<u>test</u>\'}"></p>')($rootScope);
			$rootScope.$digest();
			// Verify content is not escaped.
			expect(element.text()).toEqual('test');
			expect(element.html()).toEqual('<u>test</u>');
		});
	});

	describe('translate sanitization (escaping)', function() {

		var $rootScope, $compile;

		beforeEach(module('pascalprecht.translate', function($translateProvider, $provide) {

			$translateProvider.translations('en', {
				'hacking': '{{v}}'
			});

			$translateProvider
				.preferredLanguage('en')
				.useSanitizeValueStrategy('escaped');
		}));

		beforeEach(inject(function(_$rootScope_, _$compile_) {
			$rootScope = _$rootScope_;
			$compile = _$compile_;
		}));

		it('should be enabled via useSanitizedValues(true)', function() {
			element = $compile('<p translate="hacking" translate-values="{v: \'<u>test</u>\'}"></p>')($rootScope);
			$rootScope.$digest();
			// Verify content is escaped.
			expect(element.text()).toEqual('<u>test</u>'); // possible because text
			expect(element.html()).toEqual('&lt;u&gt;test&lt;/u&gt;');
		});
	});

	describe('translate-compile extension (globally disabled)', function() {

		var $rootScope, $compile;

		beforeEach(module('pascalprecht.translate', function($translateProvider, $provide) {

			$translateProvider.translations('en', {
				'text': '<span>{{name}} is a citizen of <strong ng-bind="world"></strong>!</span>'
			});

			$translateProvider.preferredLanguage('en');
		}));

		beforeEach(inject(function(_$rootScope_, _$compile_, _$translate_) {
			$rootScope = _$rootScope_;
			$compile = _$compile_;
			$translate = _$translate_;
			$rootScope.world = 'Gallifrey';
		}));

		it('should be disabled at default (global setting)', function() {
			expect($translate.isPostCompilingEnabled()).toEqual(false);
		});

		it('should be disabled at default', function() {
			element = $compile('<p translate="text" translate-values="{name: \'The Doctor\'}"></p>')($rootScope);
			$rootScope.$digest();
			// Verify we have no additional bindings (ng-bind)
			expect(element.text()).toEqual('The Doctor is a citizen of !');
			// expect(element.html()).toEqual('<span>The Doctor is a citizen of <strong ng-bind="world"></strong>!</span>');
			// unfortunately, the order of tag attributes is not deterministic in all browsers
			expect(element.find('strong').html()).toEqual('');
		});

		it('should be enabled using "translate-compile"-attribute', function() {
			element = $compile('<p translate="text" translate-compile translate-values="{name: \'The Doctor\'}"></p>')($rootScope);
			$rootScope.$digest();
			// Verify we have rich html content now
			expect(element.text()).toEqual('The Doctor is a citizen of Gallifrey!');
			// expect(element.html()).toEqual('<span class="ng-scope">The Doctor is a citizen of <strong ng-bind="world" class="ng-binding">Gallifrey</strong>!</span>');
			// unfortunately, the order of tag attributes is not deterministic in all browsers
			expect(element.find('strong').html()).toEqual('Gallifrey');
		});

		it('should consider even live binding in compiled value', function() {
			element = $compile('<p translate="text" translate-compile translate-values="{name: \'The Doctor\'}"></p>')($rootScope);
			$rootScope.$digest();
			$rootScope.world = 'Earth';
			$rootScope.$digest();
			// Verify that the new value of "world" is used.
			expect(element.text()).toEqual('The Doctor is a citizen of Earth!');
			// expect(element.html()).toEqual('<span class="ng-scope">The Doctor is a citizen of <strong ng-bind="world" class="ng-binding">Earth</strong>!</span>');
			// unfortunately, the order of tag attributes is not deterministic in all browsers
			expect(element.find('strong').html()).toEqual('Earth');
		});
	});

	describe('translate-compile extension (globally enabled)', function() {

		var $rootScope, $compile;

		beforeEach(module('pascalprecht.translate', function($translateProvider, $provide) {

			$translateProvider.translations('en', {
				'text': '<span>{{name}} is a citizen of <strong ng-bind="world"></strong>!</span>'
			});

			$translateProvider.preferredLanguage('en');
			$translateProvider.usePostCompiling(true);
		}));

		beforeEach(inject(function(_$rootScope_, _$compile_, _$translate_) {
			$rootScope = _$rootScope_;
			$compile = _$compile_;
			$translate = _$translate_;
			$rootScope.world = 'Gallifrey';
		}));

		it('should be enabled at default (global setting)', function() {
			expect($translate.isPostCompilingEnabled()).toEqual(true);
		});

		it('should be enabled at default', function() {
			element = $compile('<p translate="text" translate-values="{name: \'The Doctor\'}"></p>')($rootScope);
			$rootScope.$digest();
			// Verify we have no additional bindings (ng-bind)
			expect(element.text()).toEqual('The Doctor is a citizen of Gallifrey!');
			// expect(element.html()).toEqual('<span class="ng-scope">The Doctor is a citizen of <strong ng-bind="world" class="ng-binding">Gallifrey</strong>!</span>');
			// unfortunately, the order of tag attributes is not deterministic in all browsers
			expect(element.find('strong').html()).toEqual('Gallifrey');
		});

		it('should be enabled using "translate-compile"-attribute (actually obselet)', function() {
			element = $compile('<p translate="text" translate-compile translate-values="{name: \'The Doctor\'}"></p>')($rootScope);
			$rootScope.$digest();
			// Verify we have rich html content now
			expect(element.text()).toEqual('The Doctor is a citizen of Gallifrey!');
			// expect(element.html()).toEqual('<span class="ng-scope">The Doctor is a citizen of <strong ng-bind="world" class="ng-binding">Gallifrey</strong>!</span>');
			// unfortunately, the order of tag attributes is not deterministic in all browsers
			expect(element.find('strong').html()).toEqual('Gallifrey');

		});

		it('should be disabled using "translate-compile"-attribute (if set to "false")', function() {
			element = $compile('<p translate="text" translate-compile="false" translate-values="{name: \'The Doctor\'}"></p>')($rootScope);
			$rootScope.$digest();
			// Verify we have rich html content now
			expect(element.text()).toEqual('The Doctor is a citizen of !');
			// expect(element.html()).toEqual('<span>The Doctor is a citizen of <strong ng-bind="world"></strong>!</span>');
			// unfortunately, the order of tag attributes is not deterministic in all browsers
			expect(element.find('strong').html()).toEqual('');
		});

		it('should consider even live binding in compiled value', function() {
			element = $compile('<p translate="text" translate-values="{name: \'The Doctor\'}"></p>')($rootScope);
			$rootScope.$digest();
			$rootScope.world = 'Earth';
			$rootScope.$digest();
			// Verify that the new value of "world" is used.
			expect(element.text()).toEqual('The Doctor is a citizen of Earth!');
			// expect(element.html()).toEqual('<span class="ng-scope">The Doctor is a citizen of <strong ng-bind="world" class="ng-binding">Earth</strong>!</span>');
			// unfortunately, the order of tag attributes is not deterministic in all browsers
			expect(element.find('strong').html()).toEqual('Earth');
		});
	});

});

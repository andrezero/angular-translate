/*jshint -W087 */
ngTranslate
/**
 * @ngdoc directive
 * @name pascalprecht.translate.directive:translate
 * @requires $compile
 * @requires $filter
 * @requires $interpolate
 * @restrict A
 *
 * @description
 * Translates given translation id either through attribute or DOM content.
 * Internally it uses `translate` filter to translate translation id. It possible to
 * pass an optional `translate-values` object literal as string into translation id.
 *
 * @param {string=} translate Translation id which could be either string or interpolated string.
 * @param {string=} translate-values Values to pass into translation id. Can be passed as object literal string or interpolated object.
 *
 * @example
   <example module="ngView">
    <file name="index.html">
      <div ng-controller="TranslateCtrl">

        <pre translate="TRANSLATION_ID"></pre>
        <pre translate>TRANSLATION_ID</pre>
        <pre translate="{{translationId}}"></pre>
        <pre translate>{{translationId}}</pre>
        <pre translate="WITH_VALUES" translate-values="{value: 5}"></pre>
        <pre translate translate-values="{value: 5}">WITH_VALUES</pre>
        <pre translate="WITH_VALUES" translate-values="{{values}}"></pre>
        <pre translate translate-values="{{values}}">WITH_VALUES</pre>

      </div>
    </file>
    <file name="script.js">
      angular.module('ngView', ['pascalprecht.translate'])

      .config(function ($translateProvider) {

        $translateProvider.translations({
          'TRANSLATION_ID': 'Hello there!',
          'WITH_VALUES': 'The following value is dynamic: {{value}}'
        });

      });

      angular.module('ngView').controller('TranslateCtrl', function ($scope) {
        $scope.translationId = 'TRANSLATION_ID';

        $scope.values = {
          value: 78
        };
      });
    </file>
    <file name="scenario.js">
      it('should translate', function () {
        inject(function ($rootScope, $compile) {
          $rootScope.translationId = 'TRANSLATION_ID';

          element = $compile('<p translate="TRANSLATION_ID"></p>')($rootScope);
          $rootScope.$digest();
          expect(element.text()).toBe('Hello there!');

          element = $compile('<p translate="{{translationId}}"></p>')($rootScope);
          $rootScope.$digest();
          expect(element.text()).toBe('Hello there!');

          element = $compile('<p translate>TRANSLATION_ID</p>')($rootScope);
          $rootScope.$digest();
          expect(element.text()).toBe('Hello there!');

          element = $compile('<p translate>{{translationId}}</p>')($rootScope);
          $rootScope.$digest();
          expect(element.text()).toBe('Hello there!');
        });
      });
    </file>
   </example>
 */
.directive('translate', ['$translate', '$q', '$interpolate', '$compile', '$parse', '$rootScope',
	function($translate, $q, $interpolate, $compile, $parse, $rootScope) {
		'use strict';

		return {
			restrict: 'AE',
			scope: true,
			link: function(scope, iElement, iAttr) {
				var translateValuesExist = (iAttr.translateValues) ? iAttr.translateValues : undefined,
					translateInterpolation = (iAttr.translateInterpolation) ? iAttr.translateInterpolation : undefined,
					translateValueExist = iElement[0].outerHTML.match(/translate-value-+/i),
                    prefix = (iElement.attr('data-prefix')) ? iElement.attr('data-prefix') : undefined,
                    suffix= (iElement.attr('data-suffix')) ? iElement.attr('data-suffix') : undefined,
					fallbackValue = iElement.html();

				scope.fallbackValue = fallbackValue;
				scope.interpolateParams = {};

				// Ensures any change of the attribute "translate" containing the id will
				// be re-stored to the scope's "translationId".
				// If the attribute has no content, the element's text value (white spaces trimmed off) will be used.
				iAttr.$observe('translate', function(translationId) {
					if (angular.equals(translationId, '') || !angular.isDefined(translationId)) {
						scope.translationId = $interpolate(iElement.text().replace(/^\s+|\s+$/g, ''))(scope.$parent);
					} else {
                        // if the translate attribute has changed during runtime, we'll need to update the translation
                        if(scope.translationId !== translationId) {
                          scope.translationId = translationId;
                          updateTranslationFn();
                        }
					}
				});


				if (translateValuesExist) {
					iAttr.$observe('translateValues', function(interpolateParams) {
						if (interpolateParams) {
							scope.$parent.$watch(function() {
								angular.extend(scope.interpolateParams, $parse(interpolateParams)(scope.$parent));
							});
						}
					});
				}

				if (translateValueExist) {
					var fn = function(attrName) {
						iAttr.$observe(attrName, function(value) {
							scope.interpolateParams[angular.lowercase(attrName.substr(14))] = value;
						});
					};
					for (var attr in iAttr) {
						if (iAttr.hasOwnProperty(attr) && attr.substr(0, 14) === 'translateValue' && attr !== 'translateValues') {
							fn(attr);
						}
					}
				}

				var applyElementContent = function(value, scope) {
					var globallyEnabled = $translate.isPostCompilingEnabled(),
						locallyDefined = (typeof iAttr.translateCompile !== 'undefined'),
						locallyEnabled = (locallyDefined && iAttr.translateCompile !== 'false');

                    value = (prefix) ? prefix + value : value;
                    value = (suffix) ? value + suffix : value;

					iElement.html(value);

					if (!locallyDefined || locallyEnabled) {
						$compile(iElement.contents())(scope);
					}

				};

				var updateTranslationFn = (function() {
					if (!translateValuesExist && !translateValueExist) {
						return function() {
							var unwatch = scope.$watch('translationId', function(value) {
								if (scope.translationId && value) {
									$translate(value, {}, translateInterpolation)
										.then(function(translation) {
											applyElementContent(translation, scope);
											unwatch();
										}, function(error) {
											applyElementContent(scope.fallbackValue, scope);
											scope.$emit('Translation Error', error);
											unwatch();
										});
								}
							}, true);
						};
					} else {
						return function() {
							scope.$watch('interpolateParams', function(value) {
								if (scope.translationId && value) {
									$translate(scope.translationId, value, translateInterpolation)
										.then(function(translation) {
											applyElementContent(translation, scope);
										}, function(error) {
											applyElementContent(scope.fallbackValue, scope);
											scope.$emit('Translation Error', error);
										});
								}
							}, true);
						};
					}
				}());
				// Ensures the text will be refreshed after the current language was changed
				// w/ $translate.use(...)
				var unbind = $rootScope.$on('$translateChangeSuccess', updateTranslationFn);

				updateTranslationFn();
				scope.$on('$destroy', unbind);
			}
		};

	}
]);

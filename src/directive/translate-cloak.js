ngTranslate
/**
 * @ngdoc directive
 * @name pascalprecht.translate.directive:translateCloak
 * @requires $rootScope
 * @requires $translate
 * @restrict A
 *
 * $description
 * Adds a `translate-cloak` class name to the given element where this directive
 * is applied initially and removes it, once a loader has finished loading.
 *
 * This directive can be used to prevent initial flickering when loading translation
 * data asynchronously.
 *
 * @param {string=} translate-cloak No string required
 */
.directive('translateCloak', ['$rootScope', '$translate',
	function($rootScope, $translate) {
		'use strict';
		return {
			compile: function(tElement) {
				$rootScope.$on('$translateLoadingSuccess', function() {
					tElement.removeClass($translate.cloakClassName());
				});
				tElement.addClass($translate.cloakClassName());
			}
		};
	}
]);

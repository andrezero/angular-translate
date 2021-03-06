ngTranslate
/**
 * @ngdoc object
 * @name pascalprecht.translate.$translateMissingTranslationHandlerLog
 * @requires $log
 *
 * @description
 * Uses angular's `$log` service to give a warning when trying to translate a
 * translation id which doesn't exist.
 *
 * @returns {function} Handler function
 */
.factory('$translateMissingTranslationHandlerLog', ['$log',
	function($log) {
        'use strict';
		return function(translationId) {
			$log.warn('Translation for ' + translationId + ' doesn\'t exist');
		};
	}
]);

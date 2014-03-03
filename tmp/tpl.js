/* HTML templates */
ngTranslate.run(function($templateCache) {
  'use strict';

  $templateCache.put('templates/localeSelector.tpl.html',
    "<div class=\"btn-group\"><button type=\"button\" class=\"btn btn-default dropdown-toggle\" data-toggle=\"dropdown\" data-translate=\"{{ selectorLabelL10n }}\">{{ selectorLabel }} <span class=\"caret\"></span></button><ul class=\"dropdown-menu\" role=\"menu\"><li data-ng-repeat=\"locale in localeCollection\"><a href=\"#\" class=\"locale-{{ locale.key }}\" data-translate=\"{{ locale.L10n }}\" ng-click=\"changeLocale(locale.key)\">{{ locale.label }}</a></li></ul></div>"
  );
});

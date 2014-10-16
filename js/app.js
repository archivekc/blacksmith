var BlacksmithApp = angular.module('BlacksmithApp', ['ngRoute', 'ui.bootstrap', 'BlacksmithProviders', 'BlacksmithServices', 'BlacksmithDirectives', 'BlacksmithFilters']);
var BlacksmithProviders = angular.module('BlacksmithProviders', []);
var BlacksmithServices = angular.module('BlacksmithServices', []);
var BlacksmithDirectives = angular.module('BlacksmithDirectives', ['BlacksmithServices']);
var BlacksmithServices = angular.module('BlacksmithFilters', []);


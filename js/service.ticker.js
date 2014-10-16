var BlacksmithServices = angular.module('BlacksmithServices');

BlacksmithServices.factory('ticker', function($interval, refreshDelay) {
	var registeredCallbacks = [];

	var notify = function() {
		angular.forEach(registeredCallbacks, function(callback) {
			callback();
		});
	};
	
	$interval(notify, refreshDelay);
	
	return {
		register: function (callback) {
			registeredCallbacks.push(callback);
		}
	};
});

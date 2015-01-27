var BlacksmithDirectives = angular.module('BlacksmithDirectives');

BlacksmithDirectives.directive(
	'icon',
	function() {
		return {
			restrict: 'E',
			scope: {
				zgeg: '@'
			},
			replace: false,
			transclude: false,
			controller: function($scope, iconFlavor) {
				var flavors = {
					favicon : {
						undefined: "fa fa-question",
						failure: "fa fa-exclamation-circle",
						warning: "fa fa-exclamation",
						success: "fa fa-check"
					},
					glyphicon : {
						undefined: "glyphicon glyphicon-question-sign",
						failure: "glyphicon glyphicon-exclamation-sign",
						warning: "glyphicon glyphicon-warning-sign",
						success: "glyphicon glyphicon-ok-sign"
					}
				};
				
				$scope.$watch('zgeg', function() {
					$scope.iconClass = flavors[iconFlavor][$scope.zgeg];
				});
			},
			template: '<span class="{{iconClass}}"></span>'
		}
	}
);

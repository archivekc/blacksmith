var BlacksmithDirectives = angular.module('BlacksmithDirectives');

BlacksmithDirectives.directive(
	'sonar',
	function() {
		return {
			restrict: 'E',
			scope: {
				groupname: '@'
			},
			replace: true,
			transclude: true,
			controller: function($scope) {
				$scope.projects = [];
				
				this.addProject = function (project) {
					$scope.projects.push(project);
				};
			},
			template: '<div class="panel panel-default">' + 
					'<div class="panel-heading">' +
						'<h1 class="panel-title">Sonar</h1>' +
					'</div>' +
					'<table class="table">' +
						'<tr>' +
							'<td></td>' +
							'<th style="text-align: center" ng-repeat="project in projects">{{project.name}}</th>' +
						'</tr>' +
						'<tr>' +
							'<th><span class="glyphicon glyphicon-warning-sign" style="color: red;"></span> Blockers</th>' +
							'<td style="text-align: center" ng-repeat="project in projects">' +
								'<sonar-violation value="{{project.violations.blocker}}" label-style="label-danger" />' +
							'</td>' +
						'</tr>' +
						'<tr>' +
							'<th><span class="glyphicon glyphicon-chevron-up" style="color: red; text-shadow: 0 -0.4em red;"></span> Critical</th>' +
							'<td style="text-align: center" ng-repeat="project in projects">' +
								'<sonar-violation value="{{project.violations.critical}}" label-style="label-warning" />' +
							'</td>' +
						'</tr>' +
						'<tr>' +
							'<th><span class="glyphicon glyphicon-chevron-up" style="color: red;"></span> Major</th>' +
							'<td style="text-align: center" ng-repeat="project in projects">' +
								'<sonar-violation value="{{project.violations.major}}" />' +
							'</td>' +
						'</tr>' +
						'<tr>' +
							'<th><span class="glyphicon glyphicon-chevron-down" style="color: green;"></span> Minor</th>' +
							'<td style="text-align: center" ng-repeat="project in projects">' +
								'<sonar-violation value="{{project.violations.minor}}" />' +
							'</td>' +
						'</tr>' +
						'<tr>' +
							'<th><span class="glyphicon glyphicon-chevron-down" style="color: white; text-shadow: -2px 0 green, 0 2px green, 2px 0 green, 0 -2px green"></span> Info</th>' +
							'<td style="text-align: center" ng-repeat="project in projects">' +
								'<sonar-violation value="{{project.violations.info}}" />' +
							'</td>' +
						'</tr>' +
					'</table>' +
					'<div ng-transclude></div>'+
				'</div>'
		}
	}
);

BlacksmithDirectives.directive(
	'sonarViolation',
	function() {
		return {
			require: '^sonar',
			restrict: 'E',
			scope: {
				value: '@',
				labelStyle: '@'
			},
			replace: false,
			transclude: false,
			template: '<div ng-class="{ \'{{labelStyle}}\': (value > 0), \'label\': (labelStyle && value > 0) }">{{value}}</div>'
		};
	}
);

BlacksmithDirectives.directive(
	'sonarProject',
	function() {
		return {
			require: '^sonar',
			restrict: 'E',
			scope: {
				key: '@',
				displayname: '@'
			},
			replace: false,
			transclude: false,
			link: function (scope, element, attrs, sonarCtrl) {
				sonarCtrl.addProject(scope.project);
			},
			controller: function($scope, $element, ticker, sonar) {
				$scope.project = {};
				
				var refreshProject = function () {
					sonar
						.getViolations($scope.key)
						.then(function (value) {
							value.name = $scope.displayname;
							angular.extend($scope.project, value);
						});
				};
				
				ticker.register(function() { refreshProject(); });

				refreshProject();
			},
			template: ''
		};
	}
);

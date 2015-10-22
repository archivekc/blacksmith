var BlacksmithDirectives = angular.module('BlacksmithDirectives');

BlacksmithDirectives.directive(
	'jenkins',
	function() {
		return {
			restrict: 'E',
			scope: {
				groupname: '@'
			},
			replace: true,
			transclude: true,
			template: '<div class="panel panel-default">' +
				'<div class="panel-heading">' +
					'<h1 class="panel-title">{{groupname}}</h1>' +
				'</div>' +
				'<ul class="list-group" ng-transclude></ul>' +
			'</div>'
		}
	}
);

BlacksmithDirectives.directive(
	'jenkinsReportIcon',
	function() {
		return {
			require: '^jenkinsProject',
			restrict: 'E',
			replace: true,
			transclude: false,
			controller: function($scope, $element, $modal) {
				var modalTemplate = '<div class="modal-header">' +
						'<h3 class="modal-title">Report for {{displayname}}</h3>' +
					'</div>' +
					'<div class="modal-body">' +
						'<ul class="nav nav-tabs">' +
							'<li ng-repeat="status in statuses" ng-class="{ \'active\': (active == status.value) }">' +
								'<a ng-click="setActive(status.value)">{{status.label}} <span class="badge">{{status.testCount}}</span></a>' +
							'</li>' +
						'</ul>' +
						'<div ng-repeat="status in statuses" ng-show="active == status.value">' +
							'<div ng-show="status.displayedTests == undefined" class="well">There aren\'t any tests with this status.</div>' +
							'<ul ng-repeat="(className, names) in status.displayedTests" class="list-group">' +
								'<li class="list-group-item {{status.liststyle}}"><h4 class="list-group-item-heading">{{className}}</h4></li>' +
								'<li class="list-group-item {{status.liststyle}}" ng-repeat="name in names track by $index">{{name}}</li>' +
							'</ul>' +
							'<div class="text-center">' +
								'<pagination ng-show="status.displayedTests" ng-model="status.currentPage" total-items="status.testCount" max-size="15" items-per-page="{{itemsPerPage}}" ng-change="status.changePage()"></pagination>' +
							'</div>' +
						'</div>' +
					'</div>' +
					'<div class="modal-footer">' +
						'<button class="btn btn-primary" ng-click="$close();">Close</button>' +
					'</div>';

				$scope.open = function() {
						$modal.open({
								template: modalTemplate,
								scope: $scope,
								controller: function ($scope, $modalInstance) {

									$scope.changePage = function () {
										var tests = $scope.tests[this.value].list.slice((this.currentPage - 1) * $scope.itemsPerPage, this.currentPage * $scope.itemsPerPage);
										var displayedTests;
										if(tests.length > 0) {
											displayedTests = {};
											for(var i in tests) {
												if(displayedTests[tests[i].className] == undefined) {
													displayedTests[tests[i].className] = [];
												}
												displayedTests[tests[i].className].push(tests[i].name);
											}
										}
										this.displayedTests = displayedTests;
									};

									$scope.itemsPerPage = 7;
									$scope.statuses = [
										{
											value: "failed",
											label: "Failed",
											liststyle: "list-group-item-danger",
											currentPage: 1,
											testCount: $scope.tests.failed.count,
											displayedTests: undefined,
											changePage: $scope.changePage
										},
										{
											value: "skipped",
											label: "Skipped",
											liststyle: "list-group-item-warning",
											currentPage: 1,
											testCount: $scope.tests.skipped.count,
											displayedTests: undefined,
											changePage: $scope.changePage
										},
										{
											value: "success",
											label: "Success",
											liststyle: "list-group-item-success",
											currentPage: 1,
											testCount: $scope.tests.success.count,
											displayedTests: undefined,
											changePage: $scope.changePage
										}
									];

									for(var i in $scope.statuses) {
										$scope.statuses[i].changePage(1);
									}

									$scope.setActive = function(status) {
										$scope.active = status;
									};
									$scope.setActive("failed");
								},
								size: 'lg',
								resolve: { items: function () { return []; } }
							});
					};
			},
			template: '<button type="button" class="btn {{status.buttonstyle}} btn-xs" ng-click="open()"><icon type="{{status.id}}" /></button>'
		};
	}
);

BlacksmithDirectives.directive(
	'jenkinsProject',
	function() {
		return {
			require: '^jenkins',
			restrict: 'E',
			scope: {
				fullname: '@',
				displayname: '@'
			},
			replace: true,
			transclude: false,
			controller: function($scope, $element, ticker, jenkins) {
				var statuses = {
						UNDEFINED: {
							id: "undefined",
							liststyle: "list-group-item-default",
							buttonstyle: "label-default"
						},
						FAILED: {
							id: "failure",
							liststyle: "list-group-item-danger",
							buttonstyle: "label-danger"
						},
						HASSKIPPED: {
							id: "warning",
							liststyle: "list-group-item-warning",
							buttonstyle: "label-warning"
						},
						SUCCESS: {
							id: "success",
							liststyle: "list-group-item-success",
							buttonstyle: "label-success"
						}
					};

				var refreshProject = function () {
					jenkins
						.getNonBuildingBuild($scope.fullname)
						.then(function (value) {
							if(value.result === "UNSTABLE" ||
									value.result === "FAILURE" ||
									value.result === "NOT_BUILT" ||
									value.tests.failed.count > 0) {
								value.status = statuses.FAILED;
							} else if(value.tests.skipped.count > 0) {
								value.status = statuses.HASSKIPPED;
							} else if(value.tests.success.count > 0) {
								value.status = statuses.SUCCESS;
							} else {
								value.status = statuses.UNDEFINED;
							}

							angular.extend($scope, value);
						});
				};

				ticker.register(function() { refreshProject(); });

				refreshProject();
			},
			template:
				'<li class="list-group-item {{status.liststyle}}">' +
					'<div class="btn-group pull-right">' +
						'<jenkins-report-icon></jenkins-report-icon>' +
					'</div>' +
					'<h4 class="list-group-item-heading">' +
						'<a href="{{url}}">{{displayname}}</a> <small>{{timestamp | fromNow}}</small>' +
					'</h4>' +
					'<div style="clear: both" class="list-group-item-text" tooltip="{{tests.failed.count}} / {{tests.skipped.count}} / {{tests.success.count}}">' +
						'<progress max="100">' +
							'<bar type="danger" value="tests.failed.count * 100 / tests.total.count"><span ng-hide="(tests.failed.count / tests.total.count) < 0.05">{{tests.failed.count}}</span></bar>' +
							'<bar type="warning" value="tests.skipped.count * 100 / tests.total.count"><span ng-hide="(tests.skipped.count / tests.total.count) < 0.05">{{tests.skipped.count}}</span></bar>' +
							'<bar type="success" value="100 - (tests.skipped.count * 100 / tests.total.count).toFixed(2) - (tests.failed.count * 100 / tests.total.count).toFixed(2)"><span ng-hide="(tests.success.count / tests.total.count) < 0.05">{{tests.success.count}}</span></bar>' +

							'<bar type="default" ng-if="tests.total.count == 0" value="100">No test results</bar>' +
						'</progress>' +
					'</div>' +
				'</li>'
		};
	}
);

BlacksmithDirectives.directive(
	'jenkinsBuilding',
	function() {
		return {
			restrict: 'E',
			scope: {
				fullname: '@',
				displayname: '@'
			},
			controller: function($scope, $element, $modal, ticker, jenkins) {

				var modalTemplate = '<div class="modal-header">' +
		        		'<h4 class="modal-title">{{displayname}}</h4>' +
		      		'</div>' +
	      			'<div class="modal-body">' +
	        			'<img class="img-responsive" src="./img/do-not-push.jpg" />'+
							'</div>';

				var oldStatus = false;
				var modalInstance;

				var refreshProject = function () {
					jenkins
						.isBuilding($scope.fullname)
						.then(function(isBuilding) {
							if(isBuilding != oldStatus) {
								if(modalInstance) {
									modalInstance.close();
									modalInstance = undefined;
								}

								if(isBuilding) {
									modalInstance = $modal.open({
										scope: $scope,
								    template: modalTemplate
								  });
								}
							}

							oldStatus = isBuilding;
						});
				};

				ticker.register(function() { refreshProject(); });

				refreshProject();
			},
			replace: true,
			transclude: false,
			template: ''
		}
	}
);

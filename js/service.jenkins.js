var BlacksmithServices = angular.module('BlacksmithServices');

BlacksmithServices.factory('jenkins', function($http, $cacheFactory, $q, ticker, jenkinsUrl, jenkinsHeaders) {
	var jenkinsCache = $cacheFactory('jenkins');

	ticker.register(function () {
			jenkinsCache.removeAll();
		});

	return {
		getLastCompletedBuild: function (jobName) {
			var deferred = $q.defer();

			var reportRequest,
					updateDateRequest;

			var project;
			project = {};
			project.name = jobName;
			project.url = jenkinsUrl + 'job/' + jobName + '/lastCompletedBuild/testReport/';

			reportRequest = $http({
					method: 'GET',
					url: jenkinsUrl + 'job/' + jobName + '/lastCompletedBuild/testReport/api/json',
					headers: jenkinsHeaders,
					withCredentials: true,
					cache: jenkinsCache
				}).success(function(data) {
					project.tests = {
						failed: {
								count: data.failCount || 0,
								list: []
							},
						skipped: {
								count:data.skipCount || 0,
								list: []
							},
						total: {
								count: data.totalCount || (0 + (data.failCount || 0) + (data.skipCount || 0) + (data.passCount || 0)),
								list: []
							}
					};
					project.tests.success = {
						count: data.passCount || project.tests.total.count - project.tests.failed.count - project.tests.skipped.count,
						list: []
					};
					
					var browseSuites = function(suites) {
						angular.forEach(suites, function(suite) {
							angular.forEach(suite.cases, function(cas) {
								var v = {
										className: cas.className,
										name: cas.name
									};
								if(cas.status == "PASSED") {
									project.tests.success.list.push(v);
								} else if(cas.status == "SKIPPED") {
									project.tests.skipped.list.push(v);
								} else if(cas.status == "FAILED" || cas.status == "REGRESSION") {
									project.tests.failed.list.push(v);
								}
								project.tests.total.list.push(v);
							})
						});
					}

					angular.forEach(data.childReports, function(report) {
						browseSuites(report.result.suites);
					});
					
					browseSuites(data.suites);
				})
				.error(function() {
					project.tests = {
						failed: {
								count: 0,
								list: []
							},
						skipped: {
								count: 0,
								list: []
							},
						success: {
								count: 0,
								list: []
							},
						total: {
								count: 0,
								list: []
							}
					};
				});



			updateDateRequest = $http({
					method: 'GET',
					url: jenkinsUrl + 'job/' + jobName + '/lastCompletedBuild/api/json',
					headers: jenkinsHeaders,
					withCredentials: true,
					cache: jenkinsCache
				}).success(function(data) {
					project.timestamp = data.timestamp;
				});


			$q.all([reportRequest, updateDateRequest])
				.then(function () {
					deferred.resolve(project)
				},
				function () {
					deferred.resolve(project)
				});

			return deferred.promise;
		},
		getLastCompletedBuildURL: function (jobName) {
			var deferred = $q.defer();
			deferred.resolve();
			return deferred.promise;
		}
	}
});

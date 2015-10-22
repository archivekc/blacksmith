var BlacksmithServices = angular.module('BlacksmithServices');

BlacksmithServices.factory('jenkins', function($http, $cacheFactory, $q, ticker, jenkinsUrl, jenkinsHeaders) {
	var jenkinsCache = $cacheFactory('jenkins');

	ticker.register(function () {
			jenkinsCache.removeAll();
		});

	var httpJenkins = function(url) {
		return $http({
				method: 'GET',
				url: url,
				headers: jenkinsHeaders,
				withCredentials: true,
				cache: jenkinsCache
			});
	};

	return {
		getNonBuildingBuild: function (jobName) {
			var deferred = $q.defer();

			var reportRequest,
					updateDateRequest;

			var project;
			project = {};
			project.name = jobName;

			var resolve = function () {
				deferred.resolve(project)
			};

			httpJenkins(jenkinsUrl + 'job/' + jobName + '/lastBuild/api/json')
				.then(function(response) {
					if (!response.data.building) {
						return response;
					}
					else {
						return httpJenkins(jenkinsUrl + 'job/' + jobName + '/lastCompletedBuild/api/json');
					}
				}, resolve)
				.then(function(response) {
					project.timestamp = response.data.timestamp;
					project.result = response.data.result;
					project.url = jenkinsUrl + 'job/' + jobName + '/' + response.data.number + '/testReport/';

					return httpJenkins(jenkinsUrl + 'job/' + jobName + '/' + response.data.number + '/testReport/api/json');
				}, resolve)
				.then(function(response) {
					var data = response.data;

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
				},
				function() {
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
				})
				.finally(resolve);

			return deferred.promise;
		},
		isBuilding: function(jobName) {
			var deferred = $q.defer();

			updateDateRequest = $http({
					method: 'GET',
					url: jenkinsUrl + 'job/' + jobName + '/lastBuild/api/json',
					headers: jenkinsHeaders,
					withCredentials: true,
					cache: jenkinsCache
				}).success(function(data) {
					deferred.resolve(data.building);
				});

			return deferred.promise;
		}
	}
});

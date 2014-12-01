var BlacksmithServices = angular.module('BlacksmithServices');

BlacksmithServices.factory('sonar', function($http, $cacheFactory, $q, ticker, sonarUrl, sonarHeaders) {
	var sonarCache = $cacheFactory('sonar');

	ticker.register(function () {
			sonarCache.removeAll();
		});

	return {
		getViolations: function (projectKey) {
			var deferred = $q.defer();

			$http({
				method: 'GET',
				url: sonarUrl + 'api/resources?resource=' + projectKey + '&metrics=blocker_violations,critical_violations,major_violations,minor_violations,info_violations&format=json',
				headers: sonarHeaders,
				withCredentials: true,
				cache: sonarCache
			}).success(function(data) {
				var project, i, j, metricKey, mData;
				var translations = {
						blocker_violations: 'blocker',
						critical_violations: 'critical',
						major_violations: 'major',
						minor_violations: 'minor',
						info_violations: 'info'
					};


				project = {};
				if(data.length > 0) {
					mData = data[0];

					project.name = mData.name;
					project.url = sonarUrl + "dashboard/index?id=" + projectKey;
					project.timestamp = mData.date;
					project.violations = {};

					for(var j in mData['msr']) {
						metricKey = mData['msr'][j].key;
						if(translations[metricKey] != undefined) {
							project.violations[translations[metricKey]] = mData['msr'][j].val;
						}
					}

					deferred.resolve(project);
				}
			});

			return deferred.promise;

		}
	}
});

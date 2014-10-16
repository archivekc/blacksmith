var BlacksmithFilters = angular.module('BlacksmithFilters');



BlacksmithFilters.filter('projects', function() {
	function filter(projects, arg) {
		var i, j;
		var isOK;
		var out = [];
		var filter;
		
		if(arg !== null && typeof arg === 'object') {
			filter = arg;
		} else {
			filter = {};
		}
		
		for(i in projects) {
			isOK = true;
			for(j in filter) {
				if(filter[j] != projects[i][j]) {
					isOK = false;
					break;
				}
			}
			if(isOK) {
				out.push(projects[i]);
			}
		}
		
		return out;
	};

	return function(input, type, category) {
		var arg = {};
		if(type) {
			arg.type = type;
		}
		if(category) {
			arg.category = category;
		}
		return filter(input, arg);
	}
});


BlacksmithFilters.filter('jenkins', function(projectsFilter) {
	return function(input, category) {
		return projectsFilter(input, "jenkins", category);
	}
});

BlacksmithFilters.filter('sonar', function(projectsFilter) {
	return function(input, category) {
		return projectsFilter(input, "sonar", category);
	}
});
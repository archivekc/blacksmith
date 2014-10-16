var BlacksmithProviders = angular.module('BlacksmithProviders');

BlacksmithProviders.provider('projects', function () {
	var projects = [];
	
	this.add = function (type, category, projectInfo) {
		var i;
		var project = {};
		
		for(i in projectInfo) {
			project[i] = projectInfo[i];
		}
		
		project["type"] = type;
		project["category"] = category;
		
		projects.push(project);
	};
	
	this.$get = function() {
		return projects;
	};
});
var BlacksmithApp = angular.module('BlacksmithApp');
var BlacksmithProviders = angular.module('BlacksmithProviders');

BlacksmithApp.constant('forgeUrl', 'http://<forge_url>');
BlacksmithApp.constant('jenkinsUrl', 'http://<forge_url>/jenkins/');
BlacksmithApp.constant('jenkinsHeaders', {});
BlacksmithApp.constant('sonarUrl', 'http://<forge_url>/sonar/');
BlacksmithApp.constant('sonarHeaders', {});
BlacksmithApp.constant('refreshDelay', 60000);
BlacksmithApp.constant('carouselInterval', 30000);

BlacksmithApp.constant('projectType', {
		"SONAR": "sonar",
		"JENKINS": "jenkins"
	});

BlacksmithApp.config(function (projectsProvider, projectType) {
	projectsProvider.add(projectType.SONAR, "Sonar", { key: "sonar.project.uno:ProjectUno", displayname: "Sonar Project #1" });
	projectsProvider.add(projectType.SONAR, "Sonar", { key: "sonar.project.dos:ProjectDos", displayname: "Sonar Project #2" });
	
	projectsProvider.add(projectType.JENKINS, "Monitoring", { fullname: "MonitoringJob1", displayname: "Monitoring Job 1" });
	projectsProvider.add(projectType.JENKINS, "Monitoring", { fullname: "MonitoringJob2", displayname: "Monitoring Job 2" });
	
	projectsProvider.add(projectType.JENKINS, "Build", { fullname: "BuildJob1", displayname: "Build Job 1" });
	projectsProvider.add(projectType.JENKINS, "Build", { fullname: "BuildJob2", displayname: "Build Job 2" });
	
	projectsProvider.add(projectType.JENKINS, "Cucumber", { fullname: "CucumberPlatform1", displayname: "Platform 1" });
	projectsProvider.add(projectType.JENKINS, "Cucumber", { fullname: "CucumberPlatform2", displayname: "Platform 2" });
	projectsProvider.add(projectType.JENKINS, "Cucumber", { fullname: "CucumberPlatform3", displayname: "Platform 3" });
	projectsProvider.add(projectType.JENKINS, "Cucumber", { fullname: "CucumberPlatform4", displayname: "Platform 4" });
	projectsProvider.add(projectType.JENKINS, "Cucumber", { fullname: "CucumberPlatform5", displayname: "Platform 5" });
});
var BlacksmithApp = angular.module('BlacksmithApp');

BlacksmithApp.controller('MainController', function ($scope, forgeUrl, projects, carouselInterval) {

	$scope.forgeUrl = forgeUrl;
	$scope.projects = projects;
	$scope.carouselInterval = carouselInterval;
});
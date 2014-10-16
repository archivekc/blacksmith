BlacksmithApp.config(function ($routeProvider) {
	$routeProvider
		.when("/default", {
				templateUrl: "partials/sample.html",
				controller: "MainController"
			})
		.otherwise({
				redirectTo: "/default"
			});
});
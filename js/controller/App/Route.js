//Route
myApp.config(['$routeProvider',
  function($routeProvider) {
	  $routeProvider.
      when('/login', {
        templateUrl: 'views/login/login.html',
        controller: 'LoginController'
      }).
	  when('/register',{
		  tempalteUrl: 'views/login/Register.html',
		  controller: 'RegisterController'
	  }).
      otherwise({
        redirectTo: '/login'
      });
  }]);
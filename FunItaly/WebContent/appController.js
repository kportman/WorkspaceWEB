var app = angular.module("funItaly", []);

app.controller('regCont', ['$scope', '$http',
	function ($scope, $http){
	$scope.username="";
	$scope.password="";
	$scope.nickname="";
	$scope.description="";
	$scope.imageLink="";
	
	$scope.registration = function(){
		alert("I'm in registration function");
		$http({
			method:'POST',
			url:"/FunItaly/registration",
			transformRequest: function(arr) {
				
				var string = [];
				for( var i in arr )
				{
					string.push(encodeURIComponent(i) + "=" + encodeURIComponent(arr[i]));
				}
				return string.join("&");
			},
			data: { username: $scope.username, password: $scope.password, nickname: $scope.nickname, description: $scope.description , imageLink: $scope.imageLink },
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).success( function(info){
				window.location = "index.html";

		});// end success
		
	};// end registration function
	     
	 
	}]);
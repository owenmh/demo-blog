(function(app)
{
	app.controller('blogController', [
		'$scope',
		'blogService',
		function($scope, blogService)
		{
			angular.extend($scope, {
				state: {
					editing: false
				},
				posts: [],
				addPost: function()
				{

				},
				editPost: function(post)
				{

				}
			});

			blogService.getPosts().then(function(posts) {
				$scope.posts = posts;
			});
		}
	]);

	app.factory('blogService',['$q', function($q) {
		return {
			getPosts: function()
			{
				return $q.when([{
					title: 'A very long day',
					content: 'Today was a very long day',
					creationDate: new Date().getTime()
				}]);
			}
		};
	}]);

	app.directive('blogPost', [function() {
		return {
			restrict: 'A',
			scope: {
				post: '=ngModel'
			},
			template: "" + 
				"<div>" + 
					"<h1>{{post.title}}</h1>" +
					"<h3>{{ post.creationDate | date }}</h3>" +
					"<p>{{post.content}}</p>" +
				"</div>"
		};
	}]);

})(angular.module('blogApp', []));

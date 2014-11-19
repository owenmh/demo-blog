(function(app)
{
	app.controller('blogController', [
		'$scope',
		'blogService',
		function($scope, blogService)
		{
			angular.extend($scope, {
				state: {
					editing: false,
					activePost: null
				},
				posts: [],
				addPost: function()
				{
					var post = {
						id: '',
						title: 'Untitled Post',
						creationDate: new Date().getTime(),
						content: ''
					};
					$scope.posts.push(post);
					blogService.savePost(post);
					$scope.editPost(post);
				},
				editPost: function(post)
				{
					$scope.state.activePost = post;
					$scope.state.editing = true;
				},
				savePost: function(post)
				{
					blogService.savePost(post);
					$scope.state.editing = false;
				},
				deletePost: function(post)
				{
					$scope.state.editing = false;
					$scope.state.activePost = null;

					var i = $scope.posts.indexOf(post);
					if (i >= 0)
					{
						$scope.posts.splice(i, 1);
						blogService.deletePost(post);
					}
				}
			});

			blogService.getPosts().then(function(posts) {
				$scope.posts = posts;
			});
		}
	]);

	app.factory('blogService',['$q', function($q)
	{
		var posts = [{
			title: 'A very long day',
			content: 'Today was a very long day',
			creationDate: new Date().getTime()
		}];

		return {
			getPosts: function()
			{
				return $q.when(posts);
			},
			savePost: function(post)
			{

			},
			deletePost: function(post)
			{

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
					"<button class='btn btn-success' ng-click='edit()'>Edit Blog Post</button>" +
				"</div>",
			link: function($scope)
			{
				$scope.edit = function()
				{
					$scope.$parent.editPost($scope.post);
				};
			}
		};
	}]);

	app.directive('blogPostEditor', [function() {
		return {
			restrict: 'A',
			scope: {
				post: '=ngModel'
			},
			template: "" + 
				"<div class='form-group'>" + 
					"<h1><input type='text' ng-model='post.title' /></h1>" +
					"<h3>{{ post.creationDate | date }}</h3>" +
					"<textarea class='form-control' ng-model='post.content' rows='10'></textarea>" +
				"</div>" +
				"<div class='form-group'>" + 
					"<button class='btn btn-danger' ng-click='delete()'>Delete</button>" +
					"<button class='btn btn-primary' ng-click='save()'>Publish</button>" +
				"</div>",
			link: function($scope)
			{
				angular.extend($scope, {
					delete: function()
					{
						$scope.$parent.deletePost($scope.post);
					},
					save: function()
					{
						$scope.$parent.savePost($scope.post);
					}
				});
			}
		};
	}]);

})(angular.module('blogApp', []));

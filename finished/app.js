(function(app) {
	app.controller('blogController', [
		'$scope',
		'blogService',
		function ($scope, blogService)
		{
			angular.extend($scope, {
				state: {
					editing: false,
					activePost: null
				},
				posts: {},
				addPost: function () {
					var post = {
						id: Math.random(),
						title: 'Untitled Post',
						creationDate: new Date().getTime(),
						content: '',
						views: 0
					};

					$scope.posts[post.id] = post;
					blogService.savePost(post);
					$scope.editPost(post);
				},
				editPost: function (post) {
					$scope.state.activePost = post;
					$scope.state.editing = true;
				},
				savePost: function (post) {
					post.creationDate = new Date().getTime();
					blogService.savePost(post);
					$scope.state.editing = false;
				},
				deletePost: function (post) {
					$scope.state.editing = false;
					$scope.state.activePost = null;

					delete $scope.posts[post.id];
					blogService.deletePost(post);
				},
				viewPost: function (post) {
					post.views++;
					blogService.savePost(post);
					$scope.state.activePost = post;
				}
			});

			blogService.getPosts().then(function(posts) {
				$scope.posts = posts;
			});
		}
	]);

	app.factory('blogService',[
		'$window',
		'$q',
		function ($window, $q) {

			function getPosts() {
				return angular.fromJson($window.localStorage.posts || '{}');
			}

			function setPosts(posts) {
				$window.localStorage.posts = angular.toJson(posts);
			}

			return {
				getPosts: function() {
					return $q.when(getPosts());
				},
				savePost: function (post) {
					var posts = getPosts();
					posts[post.id] = post;
					setPosts(posts);
					return $q.when(post);
				},
				deletePost: function (post) {
					var posts = getPosts();
					delete posts[post.id];
					setPosts(posts);
					return $q.when(post);
				}
			};
		}
	]);

	app.directive('blogPost', [function () {
		return {
			restrict: 'A',
			scope: {
				post: '=ngModel'
			},
			templateUrl: 'templates/view-post.html',
			link: function ($scope) {
				$scope.edit = function () {
					$scope.$parent.editPost($scope.post);
				};
			}
		};
	}]);

	app.directive('blogPostEditor', [function () {
		return {
			restrict: 'A',
			scope: {
				post: '=ngModel'
			},
			templateUrl: 'templates/edit-post.html',
			link: function ($scope) {

				angular.extend($scope, {
					delete: function () {
						$scope.$parent.deletePost($scope.post);
					},
					save: function () {
						$scope.$parent.savePost($scope.post);
					}
				});
			}
		};
	}]);

})(angular.module('blogApp', []));

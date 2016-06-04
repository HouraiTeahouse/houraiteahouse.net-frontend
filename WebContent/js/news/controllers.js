appControllers.controller('NewsListCtrl', ['$scope', '$state', '$stateParams', 'HttpService',
  function NewsListCtrl($scope, $state, $stateParams, HttpService) {
  
    $scope.posts = [];
    $scope.taggedPosts = [];
    
    HttpService.get('news').success(function(data) {
      $scope.posts = data;
      if($stateParams.tag != null) {
        posts.forEach(function(post, index, arr) {
          if(post.tags.includes($stateParams.tag)) {
            $scope.taggedPosts.push(post);
          }
        })
      }
    })
  }
]);

appControllers.controller('NewsPostCtrl', ['$scope', '$state', '$stateParams', 'HttpService',
  function NewsPostCtrl($scope, $state, $stateParams, HttpService) {
    $scope.post = {};
    $scope.comment = {};
  
    var id = $stateParams.id;
    HttpService.get('news', id).success(function(data) {
      $scope.post = data;
    })
  
    $scope.addComment = function addComment() {
      $scope.post.comments.push({'author':$scope.comment.author,'body':$scope.comment.body});
      $scope.comment = {};
    }
  }
]);

appControllers.controller('NewsListCtrl', ['$scope', '$state', '$stateParams', 'HttpService',
  function NewsListCtrl($scope, $state, $stateParams, HttpService) {
  
    $scope.posts = [];

    if($stateParams.tag == null) {
      HttpService.get('news').success(function(data) {
        $scope.posts = data;
      });
    } else {
      HttpService.get('tags', $stateParams.tag).success(function(data) {
        $scope.posts = data;
      });
    }
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

appControllers.controller('NewsCreateCtrl', ['$scope', '$state', '$stateParams', 'HttpService',
  function NewsCreateCtrl($scope, $state, $stateParams, HttpService) {
    $scope.post = {};
    $scope.newsCreate = {};
    
    $scope.create = function create() {
      $scope.error = false;
      $scope.disabled = true;

      $scope.post.title = $scope.newsCreate.title;
      $scope.post.body = $scope.newsCreate.body;
      if($scope.newsCreate.tags.length > 0) {
        $scope.post.tags = $scope.newsCreate.tags.split(',');
      }
      HttpService.post('news', null, $scope.post)
        .then(function (resp) {
          console.log(resp);
          $state.go('newspost', {'id': resp.data.id})
        })
        .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Posting has failed.";
          $scope.disabled = false;
        });
    }
  }
]);

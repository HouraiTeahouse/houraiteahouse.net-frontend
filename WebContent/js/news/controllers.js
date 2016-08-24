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

appControllers.controller('NewsPostCtrl', ['$scope', '$state', '$stateParams', 'HttpService', 'AuthService',
  function NewsPostCtrl($scope, $state, $stateParams, HttpService, AuthService) {
    $scope.post = {};
    $scope.comment = {};
  
    var id = $stateParams.id;
    HttpService.get('news', id).success(function(data) {
      $scope.post = data;
      $scope.hasMedia = data.media != null;
    })
  
    $scope.addComment = function addComment() {
      $scope.error = false;
      $scope.disabled = true;

      AuthService.httpPostWithAuth('comment', id, $scope.comment)
        .then(function (resp) {
          console.log(resp);
          $scope.post.comments.push({'author':resp.data.author,'body':resp.data.body});
        })
        .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Failed to post comment, please try again later.";
          $scope.disabled = false;
        })
    }
  }
]);

appControllers.controller('NewsCreateCtrl', ['$scope', '$state', '$stateParams', 'AuthService',
  function NewsCreateCtrl($scope, $state, $stateParams, AuthService) {
    $scope.post = {};
    $scope.newsCreate = {};
    
    $scope.create = function create() {
      $scope.error = false;
      $scope.disabled = true;

      $scope.post.title = $scope.newsCreate.title;
      $scope.post.media = $scope.newsCreate.media;
      $scope.post.body = $scope.newsCreate.body;
      if($scope.newsCreate.tags.length > 0) {
        $scope.post.tags = $scope.newsCreate.tags.split(',');
      }
      AuthService.httpPostWithAuth('news', null, $scope.post)
        .then(function (resp) {
          $state.go('news.post', {'id': resp.data.post_id})
        })
        .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Posting has failed.";
          $scope.disabled = false;
        });
    }
  }
]);

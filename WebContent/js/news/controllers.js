appControllers.controller('NewsListCtrl', ['$scope', '$state', '$stateParams', 'HttpService',
  function NewsListCtrl($scope, $state, $stateParams, HttpService) {
  
    $scope.posts = [];

    if($stateParams.tag == null) {
      HttpService.get('news/list').success(function(data) {
        $scope.posts = data;
      });
    } else {
      HttpService.get('news/tag/get', $stateParams.tag).success(function(data) {
        $scope.posts = data;
      });
    }
  }
]);

appControllers.controller('NewsPostCtrl', ['$scope', '$state', '$stateParams', '$sce', 'AuthService',
  function NewsPostCtrl($scope, $state, $stateParams, $sce, AuthService) {
    $scope.post = {};
    $scope.comment = {};
    $scope.allowPostManagement = AuthService.allowAccess('admin');
    $scope.isAuthor = false;
    $scope.editing = false;
    
    var id = $stateParams.id;
    // We send w/ auth to see if we're the original poster
    AuthService.httpGetWithAuth('news/get', id).success(function(data) {
      $scope.post = data;
      $scope.hasMedia = data.media != null;
      $scope.postHtml = $sce.trustAsHtml($scope.post.body);
      $scope.allowPostManagement = $scope.allowPostManagement || data.isAuthor;
      $scope.postText = $scope.post.body.replace(/\<br \/\>/g, '\n');
      $scope.isAuthor = $scope.post.isAuthor;
      // Comment handling, etc is done in the comment controller
    })

    $scope.editPost = function editPost () {
      $scope.editing = true;
    }
    
    $scope.submitEdit = function submitEdit () {
      AuthService.httpPostWithAuth('news/edit', $scope.post.post_id, {'title': $scope.post.title, 'body': $scope.postText, 'media': $scope.post.media})
      .success(function (resp, status) {
        if(status == 200) {
          $scope.post.body = $scope.postText;
          $scope.postHtml = $sce.trustAsHtml($scope.post.body.replace(/\n/g, '<br />'));
          $scope.editing = false;
        }
        else {
          $scope.error = true;
          $scope.errorMessage = "Failed to edit post.  Please ensure you are logged in and try again.  If this issue persists contact an administrator.";
          $scope.disabled = false;
        }
      })
      .error(function () {
        $scope.error = true;
        $scope.errorMessage = "Failed to edit post.  Please ensure you are logged in and try again.  If this issue persists contact an administrator.";
        $scope.disabled = false;          
      })
    }
      
    $scope.addComment = function addComment() {
      $scope.error = false;
      $scope.disabled = true;

      AuthService.httpPostWithAuth('news/comment/post', id, $scope.comment)
        .success(function (resp, status) {
          if(status == 200) {
            if(!$scope.post.comments) {
              $scope.post.comments = [];
            }
            $scope.post.comments.push({'author':resp.author,'body':resp.body,'commentHtml':$sce.trustAsHtml(resp.body)});
          }
          else {
            $scope.error = true;
            $scope.errorMessage = "Failed to post comment.  Please ensure you are logged in and try again.";
            $scope.disabled = false;
          }
        })
        .error(function () {
          $scope.error = true;
          $scope.errorMessage = "Failed to post comment.  Please ensure you are logged in and try again.";
          $scope.disabled = false;
        })
    }
  }
]);

appControllers.controller('NewsCommentCtrl', ['$scope', '$sce', 'AuthService',
  function NewsCommentCtrl($scope, $sce, AuthService) {
    $scope.editing = false;
    $scope.deleting = false;
    $scope.canManage = AuthService.allowAccess('admin') || $scope.com.isAuthor;
    $scope.isAuthor = $scope.com.isAuthor;
    $scope.author = $scope.com.author;
    $scope.commentText = $scope.com.body.replace(/\<br \/\>/g, '\n');
    $scope.commentHtml = $sce.trustAsHtml($scope.com.body);
  
    $scope.editComment = function editComment () {
      $scope.editing = true;
    }
    
    $scope.submitEdit = function submitEdit () {
      AuthService.httpPostWithAuth('news/comment/edit', $scope.com.id, {'body': $scope.commentText})
        .success(function (resp, status) {
          if(status == 200) {
            $scope.com.body = $scope.commentText;
            $scope.commentHtml = $sce.trustAsHtml($scope.com.body.replace(/\n/g, '<br />'));
            $scope.editing = false;
          }
          else {
            $scope.error = true;
            $scope.errorMessage = "Failed to edit comment.  Please ensure you are logged in and try again.";
            $scope.disabled = false;
          }
        })
        .error(function () {
          $scope.error = true;
          $scope.errorMessage = "Failed to edit comment.  Please ensure you are logged in and try again.";
          $scope.disabled = false;          
        })
    }
    
    $scope.startDelete = function startDelete() {
      $scope.deleting = true;
    }
    
    $scope.deleteComment = function deleteComment () {
      AuthService.httpPostWithAuth('news/comment/delete', $scope.com.id)
        .success(function (resp, status) {
          if (status == 200) {
            $scope.commentHtml="Comment deleted.";
            comments = $scope.$parent.post.comments;
            index = comments.indexOf($scope.com);
            comments.splice(index, 1);
            $scope.$parent.post.comments = comments;
          } else {
            $scope.error = true;
            $scope.errorMessage = "Failed to delete comment.";
            $scope.deleting = false;
          }
        })
        .error(function () {
          $scope.error = true;
          $scope.errorMessage = "Failed to delete comment.";
          $scope.deleting = false;
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
      AuthService.httpPostWithAuth('news/post', null, $scope.post)
        .success(function (resp, status) {
          if(status == 200) {
            $state.go('news.post', {'id': resp.data.post_id})
          }
          else {
            $scope.error = true;
            $scope.errorMessage = "Failed to create post.  Please try again.  If this issue persists please contact an administrator.";
            $scope.disabled = false;          
          }
        })
        .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Failed to create post.  Please try again.  If this issue persists please contact an administrator.";
          $scope.disabled = false;
        });
    }
  }
]);

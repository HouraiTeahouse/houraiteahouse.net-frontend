import appControllers from '../appControllersModule.js';

appControllers.controller('NewsListCtrl', ['$scope', '$state', '$stateParams', 'HttpService', 'AuthService',
  function NewsListCtrl($scope, $state, $stateParams, HttpService, AuthService) {
    $scope.allowPostManagement = AuthService.allowAccess('admin');
    $scope.posts = [];

    if($stateParams.tag == null) {
      HttpService.get('news/list').then(function(data) {
        $scope.posts = data.data;
      })
      .catch(function() {
        $scope.showError = true;
      });
    } else {
      HttpService.get('news/tag/get', $stateParams.tag).then(function(data) {
        $scope.posts = data.data;
      });
    }
    
    $scope.createPost = function createPost () {
      $state.go('news.create');
    }
  }
]);

appControllers.controller('NewsPostCtrl', ['$scope', '$state', '$stateParams', '$sce', 'AuthService',
  function NewsPostCtrl($scope, $state, $stateParams, $sce, AuthService) {
    $scope.post = {};
    $scope.comment = {};
    $scope.allowPostManagement = AuthService.allowAccess('admin') || AuthService.allowAccess('translate');
    $scope.canTranslate = AuthService.allowAccess('translate');
    $scope.isAuthor = false;
    $scope.editing = false;
    $scope.isEdited = false;
    
    var id = $stateParams.id;
    // We send w/ auth to see if we're the original poster
    AuthService.httpGetWithAuth('news/get', id).success(function(data, status) {
      if(status == 200) {
        $scope.post = data;
        $scope.hasMedia = data.media != null;
        $scope.postHtml = $sce.trustAsHtml($scope.post.body);
        $scope.allowPostManagement = $scope.allowPostManagement || data.isAuthor;
        $scope.postText = $scope.post.body.replace(/\<br \/\>/g, '\n');
        $scope.isAuthor = $scope.post.isAuthor;
        $scope.isEdited = 'lastEdit' in $scope.post;
        // Comment handling, etc is done in the comment controller
      } else {
        $state.go('404', null, {'location': 'replace'});
      }
    })

    $scope.editPost = function editPost () {
      $scope.editing = true;
    }
    
    $scope.cancelEdit = function cancelEdit () {
      $scope.editing = false;
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
          if(resp.message == null) {
            $scope.errorMessage = "Failed to edit comment.  Please try again later."
          } else {
            $scope.errorMessage = resp.message;
          }
          $scope.disabled = false;
        }
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
            if(resp.message == null) {
              $scope.errorMessage = "Failed to post comment.  Please try again later."
            } else {
              $scope.errorMessage = resp.message;
            }
            $scope.disabled = false;
          }
        })
    }
  }
]);

appControllers.controller('NewsCommentCtrl', ['$scope', '$sce', 'AuthService',
  function NewsCommentCtrl($scope, $sce, AuthService) {
    $scope.deleting = false;
    $scope.canManage = AuthService.allowAccess('admin');
    $scope.author = $scope.com.author;
    $scope.commentText = $scope.com.body.replace(/\<br \/\>/g, '\n');
    $scope.commentHtml = $sce.trustAsHtml($scope.com.body);
  
    $scope.editComment = function editComment () {
      $scope.editing = true;
    }

    $scope.cancelEdit = function cancelEdit () {
      $scope.editing = false;
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
            if(resp.message == null) {
              $scope.errorMessage = "Failed to edit post.  Please try again later."
            } else {
              $scope.errorMessage = resp.message;
            }
            $scope.disabled = false;
          }
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

            let comments = $scope.$parent.post.comments,
                index = comments.indexOf($scope.com);

            comments.splice(index, 1);
            $scope.$parent.post.comments = comments;
          } else {
            $scope.error = true;
            if(resp.message == null) {
              $scope.errorMessage = "Failed to delete comment.  Please try again later."
            } else {
              $scope.errorMessage = resp.message;
            }
            $scope.deleting = false;
          }
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
            if(resp.message == null) {
              $scope.errorMessage = "Failed to post news.  Please try again later."
            } else {
              $scope.errorMessage = resp.message;
            }
            $scope.disabled = false;          
          }
        });
    }
  }
]);

appControllers.controller('NewsTranslateCtrl', ['$scope', '$state', '$stateParams', '$sce', 'HttpService', 'AuthService', 'LanguageService',
  function NewsTranslateCtrl($scope, $state, $stateParams, $sce, HttpService, AuthService, LanguageService) {
    $scope.post = {};
    $scope.transTitle = {};
    $scope.transBody = {};
    $scope.transLanguage = LanguageService.getLanguage();
    $scope.transLanguageName = LanguageService.getLanguageName($scope.transLanguage);
    $scope.languages = LanguageService.getSupportedLanguages();
    
    var id = $stateParams.id;

    // No auth - if you aren't allowed to translate you shouldn't even hit this controller    
    HttpService.get('news/get', id).success(function(data, status) {
      if(status == 200) {
        $scope.post = data;
        $scope.postHtml = $sce.trustAsHtml($scope.post.body);
        $scope.transBody = data.body.replace(/\<br \/\>/g, '\n');
        $scope.transTitle = data.title;
      } else {
        $state.go('404', null, {'location': 'replace'});
      }
    })
    
    $scope.loadLanguage = function(lang) {
      HttpService.get('news/get', id, null, lang.code).success(function(data, status) {
        if(status == 200) {
          if (data.title != null) {
            $scope.transTitle = data.title;
          }
          if (data.body != null) {
            $scope.transBody = data.body.replace(/\<br \/\>/g, '\n');            
          }
          $scope.transLanguage = lang.code;
          $scope.transLanguageName = lang.name;
        } else {
            $scope.error = true;
            if(data.message == null) {
              $scope.errorMessage = "Failed to fetch post in " + LanguageService.getLanguageName(lang) + ". Please try again."
            } else {
              $scope.errorMessage = data.message;
            }
            $scope.disabled = false;
          }
      });
    }
    
    $scope.changeLanguage = function(lang) {
      $scope.transLangName = LanguageService.getLanguageName(lang);
    }
    
    $scope.submitTranslation = function submitTranslation() {
      let transPost = {
        "title": $scope.transTitle,
        "body": $scope.transBody
      };

      if($scope.transLanguage == LanguageService.getLanguage()) {
        $scope.error = true;
        $scope.errorMessage = "This page is for posting translations.  Use the post's Edit button to edit this post's content.";
      } else {
        AuthService.httpPostWithAuth('news/translate', id, transPost, $scope.transLanguage).success(function(data, status) {
          if(status == 200) {
            // TODO: Switch language and/or show success message on loading post?
            $state.go('news.post', {'id': id})
          } else {
            $scope.error = true;
            if(data.message == null) {
              $scope.errorMessage = "Failed to post translation. Please try again."
            } else {
              $scope.errorMessage = data.message;
            }
          }
        })
      }
    }
  }
]);

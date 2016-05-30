posts = [
  {
    "id": 0,
    "title": "Test Post One",
    "body": [
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorem deleniti quae, neque libero voluptate maiores ullam unde voluptatem assumenda velit dolores impedit quis qui! Neque, cupiditate labore nulla? Atque, tenetur.",
      "Numquam nobis nam voluptas blanditiis eveniet in quasi possimus voluptatem temporibus doloremque delectus dolorum, voluptatum laborum aut dolorem? In rerum necessitatibus soluta incidunt nihil numquam fugit quas pariatur dolores nesciunt?",
      "Quibusdam placeat quisquam iure repellendus ad in, nihil numquam quaerat, facere alias illo. Tempora perferendis incidunt, ratione eveniet esse earum, corporis sit? Modi enim commodi odio placeat minus, error id?",
      "Corrupti voluptates asperiores ratione laudantium, eveniet molestiae possimus deleniti officia, incidunt quae et. Amet, ducimus eum ipsa reprehenderit ad, et nihil, veritatis ea doloremque ab placeat dolore impedit, quia eius."
    ],
    "tags": ["testpost","othertag"],
    "author": "LordAlfredo",
    "comments": [
      {
        "body": "I am a comment",
        "author": "james7132"
      }
    ],
    "created": 1458547127216
  },
  {
    "id": 1,
    "title": "Test Post Two",
    "body": [
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorem deleniti quae, neque libero voluptate maiores ullam unde voluptatem assumenda velit dolores impedit quis qui! Neque, cupiditate labore nulla? Atque, tenetur.",
      "Numquam nobis nam voluptas blanditiis eveniet in quasi possimus voluptatem temporibus doloremque delectus dolorum, voluptatum laborum aut dolorem? In rerum necessitatibus soluta incidunt nihil numquam fugit quas pariatur dolores nesciunt?",
      "Quibusdam placeat quisquam iure repellendus ad in, nihil numquam quaerat, facere alias illo. Tempora perferendis incidunt, ratione eveniet esse earum, corporis sit? Modi enim commodi odio placeat minus, error id?",
      "Corrupti voluptates asperiores ratione laudantium, eveniet molestiae possimus deleniti officia, incidunt quae et. Amet, ducimus eum ipsa reprehenderit ad, et nihil, veritatis ea doloremque ab placeat dolore impedit, quia eius."
    ],
    "tags": ["testpost"],
    "author": "james7132",
    "comments": [
      {
        "body": "I am a comment",
        "author": "LordAlfredo"
      }
    ],
    "created": 1408547127216
  },
  {
    "id": 2,
    "title": "Test Post Three",
    "body": [
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorem deleniti quae, neque libero voluptate maiores ullam unde voluptatem assumenda velit dolores impedit quis qui! Neque, cupiditate labore nulla? Atque, tenetur.",
      "Numquam nobis nam voluptas blanditiis eveniet in quasi possimus voluptatem temporibus doloremque delectus dolorum, voluptatum laborum aut dolorem? In rerum necessitatibus soluta incidunt nihil numquam fugit quas pariatur dolores nesciunt?",
      "Quibusdam placeat quisquam iure repellendus ad in, nihil numquam quaerat, facere alias illo. Tempora perferendis incidunt, ratione eveniet esse earum, corporis sit? Modi enim commodi odio placeat minus, error id?",
      "Corrupti voluptates asperiores ratione laudantium, eveniet molestiae possimus deleniti officia, incidunt quae et. Amet, ducimus eum ipsa reprehenderit ad, et nihil, veritatis ea doloremque ab placeat dolore impedit, quia eius."
    ],
    "tags": ["testpost"],
    "author": "james7132",
    "comments": [
      {
        "body": "I am a comment",
        "author": "LordAlfredo"
      }
    ],
    "created": 1308547127216
  }
];

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
    $scope.post = posts[id];
  
    $scope.addComment = function addComment() {
      $scope.post.comments.push({'author':$scope.comment.author,'body':$scope.comment.body});
      $scope.comment = {};
    }
  }
]);

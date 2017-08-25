import appControllers from '../appControllersModule.js';

appControllers.controller('ProjectsListCtrl', ['$scope', 'ProjectsService',
    function ($scope, ProjectsService) {
        ProjectsService.getComplete()
            .then(function (projects) {
                $scope.completedProjects = projects;
            });

        ProjectsService.getIncomplete()
            .then(function (projects) {
                $scope.incompleteProjects = projects;
            });
    }
]);

appControllers.controller('ProjectDetailCtrl', ['$scope', '$stateParams', 'ProjectsService',
    function ($scope, $stateParams, ProjectsService) {
        ProjectsService.get($stateParams.code)
            .then(function (project) {
                $scope.project = project;
            });
    }
]);

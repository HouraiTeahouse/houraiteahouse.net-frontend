import appDirectives from '../appDirectivesModule.js';

appDirectives.component('projectCard', {
    templateUrl: 'partials/projects/project-card.html',
    controller: [angular.noop],
    bindings: {
        project: '<'
    }
});

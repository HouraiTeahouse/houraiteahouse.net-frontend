import appServices from '../appServicesModule.js';
import projectsData from './fixtures.js';

appServices.service('ProjectsService', ['$q',
    function ($q) {

        this.getComplete = function () {
            return $q.resolve(projectsData.complete);
        };

        this.getIncomplete = function () {
            return $q.resolve(projectsData.incomplete);
        };

        this.get = function (code) {
            return $q.resolve([
                ...projectsData.complete,
                ...projectsData.incomplete
            ].find(project => project.code === code));
        };
    }
])

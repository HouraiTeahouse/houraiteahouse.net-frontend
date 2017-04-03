import angular from 'angular';
import App, { options } from './app.js';

beforeEach(angular.mock.module(App));

describe('App Module', () => {
    // dummy test
    it('should be called houraiteahouse', () => {
        expect(App).toBe('houraiteahouse');
    });

    // Verify that build system preprocessing is working correctly
    it('should have a base API URL.', () => {
        expect(options.api.base_url).toBe('/api');
    });
});

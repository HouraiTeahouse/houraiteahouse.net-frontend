import App from './app.js';

beforeEach(angular.mock.module(App));

describe('App Module', () => {
    // dummy test
    it('should be called houraiteahouse', () => {
        expect(App).toBe('houraiteahouse');
    });
});
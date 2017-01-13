import angular from 'angular';
import App from '../app.js';
import './services.js';

beforeEach(angular.mock.module(App));

describe("AuthService", function() {
  var authService;
  beforeEach(angular.mock.inject(function(AuthService) {
    authService = AuthService;
  }));

  it("should produce valid wiki names", function() {
    expect(authService.getWikiId("jane")).toEqual("Jane");
    expect(authService.getWikiId("John")).toEqual("John");
    expect(authService.getWikiId("alIce aCC")).toEqual("AliceAcc");
    expect(authService.getWikiId("bob abc")).toEqual("BobAbc");
    expect(authService.getWikiId("Xmd-bca")).toEqual("XmdBca");
    expect(authService.getWikiId("dAnIEl231")).toEqual("Daniel231");
  });

});

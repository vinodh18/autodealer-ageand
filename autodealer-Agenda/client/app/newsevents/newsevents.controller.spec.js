'use strict';

describe('Controller: NewseventsCtrl', function () {

  // load the controller's module
  beforeEach(module('autodealerApp'));

  var NewseventsCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NewseventsCtrl = $controller('NewseventsCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});

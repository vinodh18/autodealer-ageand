'use strict';

describe('Controller: AccessoriesCtrl', function () {

  // load the controller's module
  beforeEach(module('autodealerApp'));

  var AccessoriesCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AccessoriesCtrl = $controller('AccessoriesCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});

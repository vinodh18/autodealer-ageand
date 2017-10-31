'use strict';

describe('Controller: BranchesCtrl', function () {

  // load the controller's module
  beforeEach(module('autodealerApp'));

  var BranchesCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BranchesCtrl = $controller('BranchesCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});

'use strict';

describe('Controller: VehicletypesCtrl', function () {

  // load the controller's module
  beforeEach(module('autodealerApp'));

  var VehicletypesCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    VehicletypesCtrl = $controller('VehicletypesCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});

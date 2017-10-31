'use strict';

describe('Controller: VehiclesCtrl', function () {

  // load the controller's module
  beforeEach(module('autodealerApp'));

  var VehiclesCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    VehiclesCtrl = $controller('VehiclesCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});

'use strict';

describe('Controller: ServicetypesCtrl', function () {

  // load the controller's module
  beforeEach(module('autodealerApp'));

  var ServicetypesCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ServicetypesCtrl = $controller('ServicetypesCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});

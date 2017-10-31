'use strict';

describe('Controller: CustomervehiclesCtrl', function () {

  // load the controller's module
  beforeEach(module('autodealerApp'));

  var CustomervehiclesCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CustomervehiclesCtrl = $controller('CustomervehiclesCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});

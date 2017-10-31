'use strict';

describe('Controller: WarrantytypesCtrl', function () {

  // load the controller's module
  beforeEach(module('autodealerApp'));

  var WarrantytypesCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    WarrantytypesCtrl = $controller('WarrantytypesCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});

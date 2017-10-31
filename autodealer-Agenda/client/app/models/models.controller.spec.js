'use strict';

describe('Controller: ModelsCtrl', function () {

  // load the controller's module
  beforeEach(module('autodealerApp'));

  var ModelsCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ModelsCtrl = $controller('ModelsCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});

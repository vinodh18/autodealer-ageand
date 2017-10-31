'use strict';

describe('Controller: MakesCtrl', function () {

  // load the controller's module
  beforeEach(module('autodealerApp'));

  var MakesCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MakesCtrl = $controller('MakesCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});

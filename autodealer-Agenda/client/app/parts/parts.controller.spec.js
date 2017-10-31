'use strict';

describe('Controller: PartsCtrl', function () {

  // load the controller's module
  beforeEach(module('autodealerApp'));

  var PartsCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PartsCtrl = $controller('PartsCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});

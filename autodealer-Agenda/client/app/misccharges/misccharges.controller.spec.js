'use strict';

describe('Controller: MiscchargesCtrl', function () {

  // load the controller's module
  beforeEach(module('autodealerApp'));

  var MiscchargesCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MiscchargesCtrl = $controller('MiscchargesCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});

'use strict';

describe('Controller: DevicetokensCtrl', function () {

  // load the controller's module
  beforeEach(module('autodealerApp'));

  var DevicetokensCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DevicetokensCtrl = $controller('DevicetokensCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});

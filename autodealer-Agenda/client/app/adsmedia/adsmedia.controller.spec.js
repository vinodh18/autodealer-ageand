'use strict';

describe('Controller: AdsmediaCtrl', function () {

  // load the controller's module
  beforeEach(module('autodealerApp'));

  var AdsmediaCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AdsmediaCtrl = $controller('AdsmediaCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});

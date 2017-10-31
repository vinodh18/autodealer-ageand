'use strict';

describe('Controller: PartsgroupCtrl', function () {

  // load the controller's module
  beforeEach(module('autodealerApp'));

  var PartsgroupCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PartsgroupCtrl = $controller('PartsgroupCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});

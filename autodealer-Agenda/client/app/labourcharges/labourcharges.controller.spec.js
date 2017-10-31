'use strict';

describe('Controller: LabourchargesCtrl', function () {

  // load the controller's module
  beforeEach(module('autodealerApp'));

  var LabourchargesCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LabourchargesCtrl = $controller('LabourchargesCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});

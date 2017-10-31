'use strict';

describe('Controller: JobcardmastersCtrl', function () {

  // load the controller's module
  beforeEach(module('autodealerApp'));

  var JobcardmastersCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    JobcardmastersCtrl = $controller('JobcardmastersCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});

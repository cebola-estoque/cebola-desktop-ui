angular.module('inventoryAdm.controllers')

.controller('OperationsCtrl', function ($scope, AuthSvc) {
  $scope.title = 'Operações';
  
  AuthSvc.ensureLoggedIn()
});
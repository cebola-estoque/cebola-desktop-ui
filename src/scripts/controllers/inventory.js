angular.module('inventoryAdm.controllers')

.controller('InventoryCtrl', function ($scope, AuthSvc) {
  $scope.title = 'Controle de estoque';
  
  AuthSvc.ensureLoggedIn()
    .then(function () {
      // load inventory data
      console.log('load inventory data!');
    });
});
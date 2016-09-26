angular.module('inventoryAdm.controllers')

.controller('ShipmentsCtrl', function ($scope, $mdDialog, AuthSvc, CebolaSvc) {
  $scope.title = 'Carregamentos';
  
  AuthSvc.ensureLoggedIn()
    .then(function () {
      $scope.loadShipments();
    });
  
  $scope.loadShipments = function () {
    return CebolaSvc
      .listShipments(AuthSvc.getAuthToken())
      .then(function (shipments) {
        $scope.shipments = shipments;
      })
      .catch(function (err) {
        if (err.status === 401) {
          return AuthSvc.resetAuth()
            .then(function () {
              return $scope.loadShipments();
            });
        } else {
          throw err;
        }
      });
  };
  
  $scope.openCreateShipmentDialog = function () {
    return $mdDialog.show({
      controller: function ($scope, $q, $mdDialog) {
        
        $scope.shipmentData = {
          // start with one operation
          operations: [{}],
        };
        
        $scope.searchProducts = function (searchText) {
          if ($scope.shipmentData.type === 'exit') {
            return CebolaSvc.searchInventory(
              AuthSvc.getAuthToken(),
              searchText
            );
          } else {
            // by default search through all product models
            return CebolaSvc.searchProductModels(
              AuthSvc.getAuthToken(),
              searchText
            );
          } 
        };
        
        $scope.searchOrganizationContacts = function (searchText) {
          return CebolaSvc.searchOrganizationContacts(
            AuthSvc.getAuthToken(),
            searchText
          );
        };
        
        $scope.close = function () {
          $mdDialog.hide();
        };
        
        $scope.submit = function () {
          var type = $scope.shipmentData.type;
          var source = $scope.shipmentData.source;
          var scheduledFor = $scope.shipmentData.scheduledFor;
          
          
          var operations = $scope.shipmentData
            .operations.map(function (opData) {
              
              var productModel  = opData.productModel;
              var productExpiry = opData.productExpiry;
              var quantity      = opData.quantity;
              
              return {
                productModel: productModel,
                productExpiry: productExpiry,
                quantity: quantity,
              };
            });
          
          console.log('submit shipment', $scope.shipmentData);
          
          CebolaSvc.createShipment(
            AuthSvc.getAuthToken(),
            {
              type: type,
              scheduledFor: scheduledFor,
              source: source,
            },
            operations
          )
          .then(function () {
            $mdDialog.hide();
          })
          .catch(function (err) {
            alert('houve um erro ao criar um modelo de produto');
            console.warn(err);
          });
        };
        
        $scope.addScheduledOperation = function () {
          $scope.shipmentData.operations.push({});
        };
        
      },
      templateUrl: 'templates/dialogs/new-shipment.html'
    })
    .then(function () {
      return $scope.loadShipments();
    });
  };
});
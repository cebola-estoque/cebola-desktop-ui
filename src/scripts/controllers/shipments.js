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

  /**
   * Opens a dialog to present the details of a shipment
   * 
   * @param  {Object} shipment
   */
  $scope.openShipmentDetailsDialog = function (shipmentId) {

    return CebolaSvc.getShipmentById(
      AuthSvc.getAuthToken(),
      shipmentId
    )
    .then(function (shipment) {

      console.log(shipment);

      return $mdDialog.show({
        controller: function ($scope, $q, $mdDialog) {
          $scope.shipment = shipment;
          
          $scope.close = function () {
            $mdDialog.hide();
          };
        },
        templateUrl: 'templates/dialogs/shipment/details.html'
      });

    });

  };
  
  /**
   * Opens dialog for creating a new entry shipment
   * @return {Bluebird}
   */
  $scope.openEntryShipmentDialog = function () {
    return $mdDialog.show({
      controller: function ($scope, $q, $mdDialog) {
        
        $scope.supplier     = undefined;
        $scope.shipmentData = {
          type: 'entry'
        };
        $scope.allocations  = [{}];
        
        $scope.searchProducts = function (searchText) {
          // by default search through all product models
          return CebolaSvc.searchProductModels(
            AuthSvc.getAuthToken(),
            searchText
          );
        };
        
        $scope.searchOrganizations = function (searchText) {
          return CebolaSvc.searchOrganizations(
            AuthSvc.getAuthToken(),
            searchText
          );
        };
        
        $scope.close = function () {
          $mdDialog.hide();
        };
        
        $scope.submit = function () {
          var supplier     = $scope.supplier;
          var scheduledFor = $scope.shipmentData.scheduledFor;
          var allocations  = $scope.allocations;

          CebolaSvc.scheduleEntryShipment(
            AuthSvc.getAuthToken(),
            supplier,
            $scope.shipmentData,
            allocations
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
          $scope.allocations.push({});
        };
        
      },
      templateUrl: 'templates/dialogs/shipment/new-entry.html'
    })
    .then(function () {
      return $scope.loadShipments();
    });
  };
});
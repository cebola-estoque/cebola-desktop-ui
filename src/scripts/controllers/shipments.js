angular.module('inventoryAdm.controllers')

/**
 * Controller for the ShipmentsEntries
 * Defines logic for showing entry shipments and opening
 * the dialog to create a new entry shipment
 */
.controller('ShipmentsEntriesCtrl', function ($scope, $mdDialog, AuthSvc, CebolaSvc) {
  
  AuthSvc.ensureLoggedIn()
    .then(function () {
      $scope.loadEntryShipments();
    });
  
  $scope.loadEntryShipments = function () {

    // only entries
    query = { type: 'entry' };

    return CebolaSvc
      .listShipments(AuthSvc.getAuthToken(), query)
      .then(function (shipments) {
        $scope.shipments = shipments;
      })
      .catch(function (err) {
        if (err.status === 401) {
          return AuthSvc.resetAuth()
            .then(function () {
              return $scope.loadEntryShipments();
            });
        } else {
          throw err;
        }
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
      return $scope.loadEntryShipments();
    });
  };
})

/**
 * ShipmentExits controller
 * Defines logic to display exit shipments and 
 * to open the dialog to create a new exit shipment
 */
.controller('ShipmentsExitsCtrl', function ($scope, $mdDialog, AuthSvc, CebolaSvc) {
  
  AuthSvc.ensureLoggedIn()
    .then(function () {
      $scope.loadExitShipments();
    });
  
  $scope.loadExitShipments = function () {

    // only exits
    query = { type: 'exit' };

    return CebolaSvc
      .listShipments(AuthSvc.getAuthToken(), query)
      .then(function (shipments) {
        $scope.shipments = shipments;
      })
      .catch(function (err) {
        if (err.status === 401) {
          return AuthSvc.resetAuth()
            .then(function () {
              return $scope.loadExitShipments();
            });
        } else {
          throw err;
        }
      });
  };
  
  /**
   * Opens dialog for creating a new exit shipment
   * @return {Bluebird}
   */
  $scope.openExitShipmentDialog = function () {
    return $mdDialog.show({
      controller: function ($scope, $q, $mdDialog) {
        
        $scope.supplier     = undefined;
        $scope.shipmentData = {
          type: 'exit'
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
      templateUrl: 'templates/dialogs/shipment/new-exit.html'
    })
    .then(function () {
      return $scope.loadExitShipments();
    });
  };
})

/**
 * Controller that defines logic to display details of
 * a given shipment.
 *
 * Defines logic for effectivating each of the allocations of each shipment.
 */
.controller('ShipmentsDetailCtrl', function ($scope, $mdDialog, $stateParams, AuthSvc, CebolaSvc) {
  
  AuthSvc.ensureLoggedIn()
    .then(function () {
      $scope.loadShipmentDetails();
    });

  /**
   * Loads the shipment's data into scope
   * @return {[type]} [description]
   */
  $scope.loadShipmentDetails = function () {
    return CebolaSvc.getShipmentById(
      AuthSvc.getAuthToken(),
      $stateParams.shipmentId
    )
    .then(function (shipment) {

      console.log(shipment);

      $scope.shipment = shipment;
    })
  };

  /**
   * Opens a dialog for creating a new operation optionally
   * from an allocation
   * 
   * @param  {Object} allocation
   * @return {Bluebird}
   */
  $scope.openNewOperationDialog = function (shipment, allocation) {
    return $mdDialog.show({
      controller: function ($scope, $mdDialog, $q) {

        /**
         * The source allocation to which this operation
         * corresponds.
         * 
         * @type {Object}
         */
        $scope.allocation = allocation;

        /**
         * The new operation to be created
         * It inherits some data from the source allocation
         * 
         * @type {Object}
         */
        $scope.operation = {
          type: shipment.type,
          shipment: {
            _id: shipment._id,
            scheduledFor: shipment.scheduledFor,
          },
          quantity: {
            value: undefined,
            unit: allocation.quantity.unit,
          },
          productModel: allocation.productModel,
          productExpiry: allocation.productExpiry,
        };

        $scope.close = function () {
          $mdDialog.hide();
        };

        $scope.submit = function () {

          var shipmentId = shipment._id;
          var operationType = shipment.type;

          if (!$scope.operation.quantity.value) {
            throw new Error('quantity.value is required');
          }

          if ($scope.operation.quantity.value > $scope.allocation.remaining.value) {
            $scope.operationForm.quantityValue.$error.excess = true;

            return;
          }

          return CebolaSvc.registerEntryOperation(
            AuthSvc.getAuthToken(),
            shipmentId,
            $scope.operation
          )
          .then(function () {
            $mdDialog.hide();
          })
          .catch(function (err) {
            alert('houve um erro ao efetivar a operação');
            console.warn(err);
          });
        };

      },
      templateUrl: 'templates/dialogs/new-operation-from-allocation.html'
    })
    .then(function () {
      return $scope.loadShipmentDetails();
    });
  };
});
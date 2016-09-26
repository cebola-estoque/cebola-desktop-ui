angular.module('inventoryAdm.services')

.factory('CebolaSvc', function ($q, $http, $mdDialog, CONFIG) {
  
  var API_URI = CONFIG.INVENTORY_API_URI;
  
  function _authConfig(authToken, config) {
    config = config || {};
    
    config.headers = config.headers || {};
    config.headers['Authorization'] = 'Bearer ' + authToken;
    
    return config;
  }
  
  return {
    listOrganizations: function (authToken) {
      return $http.get(
        API_URI + '/organizations',
        _authConfig(authToken)
      )
      .then(function (res) {
        return res.data;
      });
    },
    
    searchOrganizations: function (authToken, searchText) {
      return $http.get(
        API_URI + '/organizations?q=' + searchText,
        _authConfig(authToken)
      )
      .then(function (res) {
        return res.data;
      });
    },
    
    createOrganization: function (authToken, data) {
      return $http.post(
        API_URI + '/organizations',
        data,
        _authConfig(authToken)
      );
    },
    
    listProductModels: function (authToken) {
      return $http.get(
        API_URI + '/product-models',
        _authConfig(authToken)
      )
      .then(function (res) {
        return res.data;
      });
    },
    
    searchProductModels: function (authToken, query) {
      return $http.get(
        API_URI + '/product-models?q=' + query,
        _authConfig(authToken)
      )
      .then(function (res) {
        return res.data;
      });
    },
    
    createProductModel: function (authToken, data) {
      return $http.post(
        API_URI + '/product-models',
        data,
        _authConfig(authToken)
      );
    },
    
    listShipments: function (authToken) {
      return $http.get(
        API_URI + '/shipments',
        _authConfig(authToken)
      )
      .then(function (res) {
        return res.data;
      });
    },
    
    searchInventory: function (authToken, query) {
      return $http.get(
        API_URI + '/inventory/search?q=' + query,
        _authConfig(authToken)
      )
      .then(function (res) {
        return res.data;
      });
    },
    
    /**
     * Shipment-related methods
     */

    /**
     * Creates a shipment and its associated allocations
     */
    scheduleEntryShipment: function (authToken, supplier, shipmentData, allocations) {
      
      shipmentData.supplier    = supplier;
      shipmentData.allocations = allocations;
      
      return $http.post(
        API_URI + '/shipments/entries',
        shipmentData,
        _authConfig(authToken)
      )
      .then(function (res) {
        return res.data;
      });
    },

    scheduleExitShipment: function (authToken, destination, shipmentData, allocations) {
      shipmentData.destination = destination;
      shipmentData.allocations = allocations;
      
      return $http.post(
        API_URI + '/shipments/entries',
        shipmentData,
        _authConfig(authToken)
      )
      .then(function (res) {
        return res.data;
      });
    },

    getShipmentById: function (authToken, shipmentId) {
      return $http.get(
        API_URI + '/shipment/' + shipmentId,
        _authConfig(authToken)
      )
      .then(function (res) {
        return res.data;
      });
    },

    /**
     * Operation-related methods
     */
    registerEntryOperation: function (authToken, shipmentId, operationData) {
      return $http.post(
        API_URI + '/shipment/' + shipmentId + '/operations/entries',
        operationData,
        _authConfig(authToken)
      )
      .then(function (res) {
        return res.data;
      });
    },

    registerExitOperation: function (authToken, shipmentId, operationData) {
      return $http.post(
        API_URI + '/shipment/' + shipmentId + '/operations/exits',
        operationData,
        _authConfig(authToken)
      )
      .then(function (res) {
        return res.data;
      });
    },
  }
});
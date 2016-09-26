(function () {
  
  var TRAILING_SLASH_RE = /\/$/;
    
  angular.module('inventoryAdm', [
    'inventoryAdm.controllers',
    'ui.router',
    'ngMaterial',
    'ngMessages',
  ])
  
  /**
   * Configurations
   */
  .constant('CONFIG', {
    INVENTORY_API_URI: 
      window.CONFIG.INVENTORY_API_URI.replace(TRAILING_SLASH_RE, ''),
  })
  
  .config(function($stateProvider, $urlRouterProvider) {
  
    // $stateProvider
    
    $stateProvider
      .state('auth', {
        url: '/auth',
        templateUrl: 'templates/auth.html',
        controller: 'AuthCtrl',
      })
      .state('inventory', {
        url: '/inventory',
        templateUrl: 'templates/inventory.html',
        controller: 'InventoryCtrl',
      })
      .state('operations', {
        url: '/operations',
        templateUrl: 'templates/operations.html',
        controller: 'OperationsCtrl',
      })
      .state('organizations', {
        url: '/organizations',
        templateUrl: 'templates/organizations.html',
        controller: 'OrganizationsCtrl',
      })
      .state('product-models', {
        url: '/product-models',
        templateUrl: 'templates/product-models.html',
        controller: 'ProductModelsCtrl',
      })
      .state('shipments', {
        abstract: true,
        templateUrl: 'templates/shipments.html',
      })
      .state('shipments.list', {
        url: '/shipments',
        templateUrl: 'templates/shipments.list.html',
        controller: 'ShipmentsListCtrl',
      })
      .state('shipments.detail', {
        url: '/shipment/:shipmentId',
        templateUrl: 'templates/shipments.detail.html',
        controller: 'ShipmentsDetailCtrl',
      });
  
    
    // .state('estoque', {
    //   url: '/estoque',
    //   templateUrl: 'templates/estoque.html',
    //   controller: 'EstoqueCtrl',
    // })
  
    // .state('operacoes', {
    //   url: '/operacoes',
    //   templateUrl: 'templates/operacoes.html',
    //   controller: 'OperacoesCtrl',
    // })
  
    // .state('receptores', {
    //   url: '/receptores',
    //   templateUrl: 'templates/receptores.html',
    //   controller: 'ReceptoresCtrl',
    // })
  
    // .state('produtos', {
    //   url: '/produtos',
    //   templateUrl: 'templates/produtos.html',
    //   controller: 'ProdutosCtrl',
    // });
    
    // // if none of the above states are matched, use this as the fallback
    // $urlRouterProvider.otherwise('/estoque');
  
  })
  
  // http interceptor that shows loading indicator on ajax request
  .config(['$httpProvider', function($httpProvider) {
  
    // alternatively, register the interceptor via an anonymous factory
    $httpProvider.interceptors.push(function($q, $rootScope) {
      return {
        request: function(config) {
  
          $rootScope.isLoading = true;
  
          return config;
        },
  
        // optional method
        requestError: function(rejection) {
          // do something on error
          
          $rootScope.isLoading = false;
  
          return $q.reject(rejection);
        },
  
        response: function(response) {
  
          $rootScope.isLoading = false;
  
          // same as above
          return response;
        },
  
        // optional method
        responseError: function(rejection) {
          // do something on error
          $rootScope.isLoading = false;
  
          return $q.reject(rejection);
        }
      };
    });
  }]);
})();



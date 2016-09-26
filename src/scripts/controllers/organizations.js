angular.module('inventoryAdm.controllers')

.controller('OrganizationsCtrl', function ($scope, $mdDialog, AuthSvc, CebolaSvc) {
  $scope.title = 'Organizações';
  
  AuthSvc.ensureLoggedIn()
    .then(function () {
      $scope.loadOrganizations();
    });
    
  $scope.loadOrganizations = function () {
    return CebolaSvc
      .listOrganizations(AuthSvc.getAuthToken())
      .then(function (orgContacts) {
        $scope.orgContacts = orgContacts;
      })
      .catch(function (err) {
        
        if (err.status === 401) {
          return AuthSvc.resetAuth()
            .then(function () {
              return $scope.loadOrganizations();
            });
        } else {
          throw err;
        }
      });
  };
  
  $scope.openCreateOrgContactDialog = function () {
    $mdDialog.show({
      controller: function ($scope, $mdDialog) {
        $scope.orgContactData = {};
        
        $scope.close = function () {
          $mdDialog.hide();
        };
        
        $scope.submit = function () {
          
          var name = $scope.orgContactData.name;
          var docType = $scope.orgContactData.docType;
          var docValue = $scope.orgContactData.docValue;
          
          if (!name || !docType || !docValue) {
            return;
          }
          
          return CebolaSvc.createOrganization(
            AuthSvc.getAuthToken(),
            {
              name: name,
              document: {
                type: docType,
                value: docValue,
              }
            }
          )
          .then(function () {
            $mdDialog.hide();
          })
          .catch(function (err) {
            alert('houve um error ao criar uma nova organização');
          });
        }
      },
      templateUrl: 'templates/dialogs/new-organization.html',
    })
    .then(function () {
      return $scope.loadOrganizations();
    });
  };
});
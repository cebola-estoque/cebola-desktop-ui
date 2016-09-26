const AUTH_TOKEN_STORAGE_KEY = 'inventory_api_auth_token';

angular.module('inventoryAdm.services')

.factory('AuthSvc', function ($q, $http, $mdDialog, CONFIG) {
  
  var API_URI = CONFIG.INVENTORY_API_URI;
  
  return {
    
    ensureLoggedIn: function () {
      
      var defer = $q.defer();
      
      // check if there is a token in the local storage
      var token = window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
      
      if (!token) {
        this.logIn(defer);
      } else {
        defer.resolve();
      }
      
      return defer.promise;
    },
    
    getAuthToken: function () {
      return window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
    },
    
    resetAuth: function () {
      window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
      
      return this.ensureLoggedIn();
    },
    
    logIn: function (defer) {
      
      defer = defer || $q.defer();
      
      var svc = this;
      
      $mdDialog.show({
        controller: function ($scope, $mdDialog) {
          
          $scope.logInData = {};
          
          $scope.signUp = function () {
            $mdDialog.hide();
            svc.signUp(defer);
          };
          
          $scope.submit = function () {
            console.log('logIn', $scope.logInData);
            
            var email = $scope.logInData.email;
            var password = $scope.logInData.password;
            
            if (!email || !password) {
              return;
            }

            return $http.post(API_URI + '/auth/token/generate', {
              email: email,
              password: password,
            })
            .then(function (res) {
              
              var token = res.data.token;
              
              window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
              
              $mdDialog.hide();
              defer.resolve();
            })
            .catch(function (err) {
              alert('houve um erro no login')
            });
          }
        },
        templateUrl: 'templates/dialogs/log-in.html',
        clickOutsideToClose: false,
        escapeToClose: false,
        fullscreen: false,
      });
      
      return defer.promise;
    },
    
    signUp: function (defer) {
      defer = defer || $q.defer();
      
      var svc = this;
      
      $mdDialog.show({
        controller: function ($scope) {
          $scope.signUpData = {};
          
          $scope.logIn = function () {
            $mdDialog.hide();
            svc.logIn(defer);
          };
          
          $scope.submit = function () {
            console.log('signUp', $scope.signUpData);
            
            var name = $scope.signUpData.name;
            var email = $scope.signUpData.email;
            var password = $scope.signUpData.password;
            var passwordConfirmation = $scope.signUpData.passwordConfirmation;
            
            if (!name || !email || !password || !passwordConfirmation) {
              return;
            }
            
            if (password !== passwordConfirmation) {
              $scope.signUpForm.passwordConfirmation.$error.passwordMismatch = true;
              return;
            } else {
              $scope.signUpForm.passwordConfirmation.$error = false;
            }
            
            $http.post(API_URI + '/users', {
              name: name,
              email: email,
              password: password,
            })
            .then(function () {
              
              return $http.post(API_URI + '/auth/token/generate', {
                email: email,
                password: password,
              });
              
            })
            .then(function (res) {
              
              var token = res.data.token;
              
              window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
              
              $mdDialog.hide();
              defer.resolve();
            })
            .catch(function (err) {
              alert('houve um erro no signup');
              console.warn(err);
            });
          }
        },
        templateUrl: 'templates/dialogs/sign-up.html',
        clickOutsideToClose: false,
        escapeToClose: false,
        fullscreen: false,
      });
      
      return defer.promise;
    },
  }
});
angular.module('aboilerplate')
  .controller('ShellController', ['$scope', '$rootScope', function ShellController($scope, $rootScope) {
    $scope.year = new Date().getFullYear();
  }]);
angular.module('aboilerplate')
  .controller('HomeController', ['$scope', '$rootScope', 'HomeService', function HomeController($scope, $rootScope, HomeService) {
    function init() {
      fetchData();
    }

    function fetchData() {
    }

    init();
  }]);
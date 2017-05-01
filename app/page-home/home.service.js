// dashboard service
angular.module('aboilerplate').service('HomeService', ['API_BASE_URL', '$http', '$q', function HomeService(API_BASE_URL, $http, $q) {
  // API_BASE_URL is set as a constant on app.js
  var baseUrl = API_BASE_URL;

  this.all = function all() {
    return $http.get(baseUrl)
      .then(function onSuccess(response) {
        return response.data.result;
      });
  }
}]);
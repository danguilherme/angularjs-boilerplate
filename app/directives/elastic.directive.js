/**
 * Make text area height equal to how much text it has
 */
angular.module('aboilerplate')
  .directive('elastic', [
    '$timeout',
    function ($timeout) {
      return {
        restrict: 'A',
        link: function ($scope, element) {
          var resize = function () {
            element[0].style.height = "" + element[0].scrollHeight + "px";
          };
          element.on("input change", resize);
          $timeout(resize);
        }
      };
    }
  ]);
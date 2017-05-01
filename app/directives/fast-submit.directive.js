/**
 * Call a funcion on ctrl + enter
 */
angular.module('aboilerplate')
  .directive('fastSubmit', [
    '$parse',
    function ($parse) {
      return {
        restrict: 'A',
        link: function ($scope, element, attrs) {
          var ENTER_KEYCODE = 13;

          var callback = $parse(attrs.fastSubmit);

          function checkSubmitKeysPressed(evt) {
            if (evt.ctrlKey && evt.keyCode === ENTER_KEYCODE) {
              $scope.$apply(callback)
            }
          }
          element.on("keyup", checkSubmitKeysPressed);
        }
      };
    }
  ]);
/**
 * Call a funcion on esc
 */
angular.module('aboilerplate')
  .directive('fastEscape', [
    '$parse',
    function ($parse) {
      return {
        restrict: 'A',
        link: function ($scope, element, attrs) {
          var ESC_KEYCODE = 27;

          var callback = $parse(attrs.fastEscape);

          function checkEscapeKeysPressed(evt) {
            if (evt.keyCode === ESC_KEYCODE) {
              $scope.$apply(callback)
            }
          }
          element.on("keyup", checkEscapeKeysPressed);
        }
      };
    }
  ]);
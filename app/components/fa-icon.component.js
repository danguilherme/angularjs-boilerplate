angular.module('aboilerplate')
  .component('faIcon', {
    templateUrl: 'app/components/fa-icon.component.html',
    transclude: true,
    bindings: {
      'icon': '@'
    }
  });
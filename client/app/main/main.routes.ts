'use strict';


export default function routes($stateProvider) {
  'ngInject';
  $stateProvider
    .state('main', {
      url: '/:searchText',
      template: '<main></main>',
      controller: function($scope, $stateParams) {
        $scope.searchText = $stateParams.searchText;
      }
    });
};

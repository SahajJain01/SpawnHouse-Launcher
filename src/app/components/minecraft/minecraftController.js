angular.module('app').controller('minecraftController', function($scope, userService) {
    $scope.userName = userService.getUsername();
});
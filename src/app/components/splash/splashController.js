angular.module("app").controller("splashController", function ($scope, $state) {
  setTimeout(function () {
    $state.go("home.library");
  }, 4500);
  // $scope.splashtext = "Splash screen text";
  // $scope.startsplash = function (text) {
  //   $scope.splashtext = text;
  // };
});

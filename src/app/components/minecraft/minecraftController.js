angular
  .module("app")
  .controller("minecraftController", function ($scope, $http, userService) {
    // window.api.receive("launchMinecraftMumbleResponse", (data) => {
    //   console.log(`Received ${data} from main process`);

    //   $scope.isInstalled = data.status;
    // });
    // window.api.send("launchMinecraftMumbleRequest", "some data");

    $http
      .get(
        "https://plan.sain.host/v1/serverOverview?server=de07eaca-346a-4c3b-ae62-8a75004da1f9"
      )
      .then(function (response) {
        $scope.game = response.data;
        console.log($scope.game);
      });

    $scope.isInstalled = true;
    $scope.isDownloading = true;
    $scope.isInstalling = true;

    $scope.install = function () {
      window.api.receive("downloadExtractMinecraftLatestResponse", (data) => {
        console.log(`Received ${data} from main process`);
      });
      window.api.send("downloadExtractMinecraftLatestRequest", "some data");
    };
    $scope.play = function () {
      window.api.receive("launchMinecraftMumbleResponse", (data) => {
        console.log(`Received ${data} from main process`);
      });
      window.api.send("launchMinecraftMumbleRequest", "some data");
    };
  });

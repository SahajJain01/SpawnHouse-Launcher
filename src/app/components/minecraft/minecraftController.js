angular
  .module("app")
  .controller("minecraftController", function ($scope, userService) {
    // window.api.receive("launchMinecraftMumbleResponse", (data) => {
    //   console.log(`Received ${data} from main process`);

    //   $scope.isInstalled = data.status;
    // });
    // window.api.send("launchMinecraftMumbleRequest", "some data");

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

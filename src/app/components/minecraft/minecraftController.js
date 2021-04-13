angular.module('app').controller('minecraftController', function($scope, userService) {
    $scope.install = function() {
        window.api.receive("downloadExtractMinecraftLatestResponse", (data) => {
            console.log(`Received ${data} from main process`);
        });
        window.api.send("downloadExtractMinecraftLatestRequest", "some data");
    }
    $scope.play = function() {
        window.api.receive("launchMinecraftMumbleResponse", (data) => {
            console.log(`Received ${data} from main process`);
        });
        window.api.send("launchMinecraftMumbleRequest", "some data");
    }
});
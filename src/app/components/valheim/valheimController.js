angular.module('app').controller('valheimController', function($scope){
    $scope.install = function() {
        window.api.receive("fromMainInstall", (data) => {
            console.log(`Received ${data} from main process`);
        });
        window.api.send("toMainInstall", "some data");
    }
    $scope.reg = function() {
        window.api.receive("downloadExtractRegisterMumbleResponse", (data) => {
            console.log(`Received ${data} from main process`);
        });
        window.api.send("downloadExtractRegisterMumbleRequest", "some data");
    }
});
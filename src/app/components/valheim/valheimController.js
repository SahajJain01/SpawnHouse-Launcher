angular.module('app').controller('valheimController', function($scope){
    $scope.install = function() {
        window.api.receive("fromMainInstall", (data) => {
            console.log(`Received ${data} from main process`);
        });
        window.api.send("toMainInstall", "some data");
    }
});
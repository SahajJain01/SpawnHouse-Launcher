// eslint-disable-next-line no-undef
angular.module('app').controller('minecraftController', function ($scope, $http) {
	$scope.statusId = 0;
	$scope.statusText = 'Not Installed';
	$scope.mumbleUserName = 'User' + Math.floor(Math.random() * 9999) + 1000;
	$scope.mumbleChecked = true;

	window.api.receive('downloadGameRes', (res) => {
		if(res.status == 200) {
			$scope.statusId = 2;
			$scope.statusText = 'Extracting';
			window.api.send('extractGameReq', {'gameId': 1});
		}
		else {
			$scope.statusId = -1;
			$scope.statusText = 'Error('+res.status+'): ' + res.data;
		}
		return;
	});
	window.api.receive('extractGameRes', (res) => {
		if(res.status == 200) {
			$scope.statusId = 3;
			$scope.statusText = 'Installing';
			window.api.send('installGameReq', {'gameId': 1});
		}
		else {
			$scope.statusId = -1;
			$scope.statusText = 'Error('+res.status+'): ' + res.data;
		}
		return;
	});
	window.api.receive('installGameRes', (res) => {
		if(res.status == 200) {
			$scope.statusId = 4;
			$scope.statusText = 'Installed';
			if($scope.mumbleChecked) {
				// if(!isMumbleInstalled) {
				// 	downloadExtractInstallMumble();
				// }
			}
			isMinecraftInstalled();
		}
		else {
			$scope.statusId = -1;
			$scope.statusText = 'Error('+res.status+'): ' + res.data;
		}
		return;
	});
	window.api.receive('isGameInstalledRes', (res) => {
		if(res.status == 200) {
			$scope.statusId = 5;
			$scope.statusText = 'Playable';
			return true;
		}
		else {
			$scope.statusId = 0;
			$scope.statusText = 'Not Installed';
			return false;
		}				
	});
	window.api.receive('playGameRes', (res) => {
		if(res.status == 200) {
			$scope.statusId = 7;
			$scope.statusText = 'Started';
			console.log($scope.statusText);
			return true;
		}
		else {
			$scope.statusId = -1;
			$scope.statusText = 'Error('+res.status+'): ' + res.data;
			return false;
		}	
	});

	$scope.download = function () {
		$scope.statusId = 1;
		$scope.statusText = 'Downloading';
		window.api.send('downloadGameReq', {'gameId': 1});
	};

	$scope.play = function () {
		$scope.statusId = 6;
		$scope.statusText = 'Starting';
		window.api.send('playGameReq', {'gameId': 1});
		// if($scope.mumbleChecked) {
		// 	window.api.receive('playGameRes', (res) => {
		// 		if(!res.status == 200) {
		// 			$scope.statusId = -1;
		// 			$scope.statusText = 'Error('+res.status+'): ' + res.data;
		// 		}		
		// 	});
		// 	window.api.send('playGameReq', {
		// 		'gameId': 0,
		// 		'params': {
		// 			'userName': $scope.mumbleUserName,
		// 			'gameId': 1
		// 		}
		// 	});
		// }
	};

	function fetchStats() {
		$http
			.get(
				'https://plan.sain.host/v1/serverOverview?server=de07eaca-346a-4c3b-ae62-8a75004da1f9'
			)
			.then(function (response) {
				$scope.game = response.data;
				console.log($scope.game);
			});
	}

	function isMinecraftInstalled() {
		window.api.send('isGameInstalledReq', {'gameId': 1});
	}

	fetchStats();
	isMinecraftInstalled();
});
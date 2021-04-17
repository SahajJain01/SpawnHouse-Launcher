// eslint-disable-next-line no-undef
angular.module('app').controller('minecraftController', function ($scope, $http) {
	$scope.statusId = 1;
	$scope.mumbleUserName = 'User' + Math.floor(Math.random() * 999) + 1;
	$scope.mumbleChecked = true;


	var selectedGameId = 1;

	$scope.statusList = [
		'Error',
		'Not Installed',
		'Downloading',
		'Extracting',
		'Installing',
		'Installed',
		'Playable',
		'Starting',
		'Started'
	];

	//#region Main API Listeners
	window.api.receive('downloadGameRes', (res) => {
		if(res.status == 200) {
			$scope.$apply(function() {
				$scope.statusId = 3;
			});
			window.api.send('extractGameReq', {'gameId': selectedGameId});
		}
		else {
			$scope.$apply(function() {
				$scope.statusId = 0;
				console.log('Error('+res.status+'): ' + res.data);
			});
		}
	});
	window.api.receive('extractGameRes', (res) => {
		if(res.status == 200) {
			$scope.$apply(function() {
				$scope.statusId = 4;
			});
			window.api.send('installGameReq', {'gameId': selectedGameId});
		}
		else {
			$scope.$apply(function() {
				$scope.statusId = 0;
				console.log('Error('+res.status+'): ' + res.data);
			});
		}
	});
	window.api.receive('installGameRes', (res) => {
		if(res.status == 200) {
			$scope.$apply(function() {
				$scope.statusId = 5;
			});
			isSelectedGameInstalled(selectedGameId);
		}
		else {
			$scope.$apply(function() {
				$scope.statusId = 0;
				console.log('Error('+res.status+'): ' + res.data);
			});
		}
	});
	window.api.receive('isGameInstalledRes', (res) => {
		if(res.status == 200) {
			$scope.$apply(function() {
				$scope.statusId = 6;
			});
			if(selectedGameId == 0) {
				$scope.statusId = 7;
				window.api.send('playGameReq', {
					'gameId': 0,
					'params': {
						'gameId': 1,
						'userName': $scope.mumbleUserName
					}
				});
				window.api.send('playGameReq', {'gameId': 1});
			}
		}
		else {
			$scope.$apply(function() {
				$scope.statusId = 1;
			});
			if(selectedGameId == 0) {
				$scope.$apply(function() {
					$scope.statusId = 2;
				});
				window.api.send('downloadGameReq', {'gameId': selectedGameId});
			}
		}	
	});
	window.api.receive('playGameRes', (res) => {
		if(res.status == 200) {
			$scope.$apply(function() {
				$scope.statusId = 8;
			});
		}
		else {
			$scope.$apply(function() {
				$scope.statusId = 0;
				console.log('Error('+res.status+'): ' + res.data);
			});
		}	
	});
	//#endregion Main API Listeners

	$scope.download = function () {
		$scope.statusId = 2;
		selectedGameId = 1;
		window.api.send('downloadGameReq', {'gameId': selectedGameId});
	};

	$scope.play = function () {
		if($scope.mumbleChecked) {
			selectedGameId = 0;
			isSelectedGameInstalled(selectedGameId);
		}
		else {
			$scope.statusId = 7;
			window.api.send('playGameReq', {'gameId': 1}); 
		}
	};

	function fetchStats() {
		$http
			.get('https://plan.sain.host/v1/serverOverview?server=de07eaca-346a-4c3b-ae62-8a75004da1f9')
			.then(function (response) {
				$scope.game = response.data;
			});
	}

	function isSelectedGameInstalled() {
		window.api.send('isGameInstalledReq', {'gameId': selectedGameId});
	}

	fetchStats();
	isSelectedGameInstalled(1);
});
// eslint-disable-next-line no-undef
angular
	.module('app')
	.controller(
		'minecraftController',
		function ($scope, $http, gameManagerService) {
			$scope.statusId = 1;

			$scope.statusList = [
				'Error',
				'Download',
				'Downloading',
				'Extracting',
				'Installing',
				'Installed',
				'Play',
				'Launching',
				'Playing Now'
			];

			$scope.download = function () {
				$scope.statusId = 2;
				gameManagerService.downloadGame({ gameId: 1 }).then(
					() => {
						$scope.statusId = 3;
						gameManagerService.extractGame({ gameId: 1 }).then(
							() => {
								$scope.statusId = 4;
								gameManagerService.installGame({ gameId: 1 }).then(
									() => {
										$scope.statusId = 5;
										isMinecraftInstalled();
									},
									(err) => {
										console.log(err);
									}
								);
							},
							(err) => {
								console.log(err);
							}
						);
					},
					(err) => {
						console.log(err);
					}
				);
			};

			$scope.play = function () {
				$scope.statusId = 7;
				gameManagerService.playGame({ gameId: 1 }).then(
					() => {
						$scope.statusId = 8;
						setTimeout(function(){
							$scope.statusId = 6;
							$scope.$apply();
						}, 10000);
					},
					(err) => {
						console.log(err);
					}
				);
			};

			function isMinecraftInstalled() {
				gameManagerService.isGameInstalled({ gameId: 1 }).then(
					() => {
						$scope.statusId = 6;
					},
					(err) => {
						if (err.status == 400) {
							console.log(err);
						}
					}
				);
			}
			isMinecraftInstalled();
		}
	);
